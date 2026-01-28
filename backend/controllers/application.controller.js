const Application = require('../models/application.js');
const Opportunity = require('../models/opportunity.js');
const Message =require('../models/message.js');
/**
 * @desc    Apply for an opportunity
 * @route   POST /api/applications/apply/:opportunityId
 * @access  Private (Volunteer only)
 */
module.exports.applyToOpportunity = async (req, res) => {
  try {
    if (req.user.role !== 'volunteer') {
      return res.status(403).json({ error: 'Forbidden: Only volunteers can apply.' });
    }

    const { opportunityId } = req.params;
    const volunteerId = req.user._id;

    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity || opportunity.status !== 'open') {
      return res.status(404).json({ error: 'Opportunity not found or is closed.' });
    }

    const existingApplication = await Application.findOne({
      opportunity: opportunityId,
      volunteer: volunteerId
    });
    if (existingApplication) {
      return res.status(400).json({ error: 'You have already applied for this opportunity.' });
    }

    // Create new application
    const application = await Application.create({
      opportunity: opportunityId,
      volunteer: volunteerId,
      status: 'pending'
    });

    const populatedApp = await application.populate({
      path: 'opportunity',
      select: 'title description location status required_skills'
    });

    res.status(201).json({
      message: 'Application submitted successfully',
      application: populatedApp
    });
  } catch (error) {
    console.error('Apply Error:', error);
    res.status(500).json({ error: 'Server error while applying' });
  }
};

/**
 * @desc    Get all applications for the logged-in volunteer
 * @route   GET /api/applications/my
 * @access  Private (Volunteer only)
 */
module.exports.getMyApplications = async (req, res) => {
  try {
    if (req.user.role !== 'volunteer') {
      return res.status(403).json({ error: 'Forbidden: Not authorized.' });
    }

    const applications = await Application.find({ volunteer: req.user._id })
      .populate({
        path: 'opportunity',
        select: 'title description location status required_skills'
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ applications });
  } catch (error) {
    console.error('Get My Apps Error:', error);
    res.status(500).json({ error: 'Server error while fetching applications' });
  }
};

/**
 * @desc    Get all applications for the logged-in NGO
 * @route   GET /api/applications/ngo
 * @access  Private (NGO only)
 */
module.exports.getNgoApplications = async (req, res) => {
  try {
    if (req.user.role !== 'ngo') {
      return res.status(403).json({ error: 'Forbidden: Not authorized.' });
    }

    // Get all opportunities posted by this NGO
    const ngoOpportunities = await Opportunity.find({ ngo: req.user._id });
    const opportunityIds = ngoOpportunities.map(opp => opp._id);

    // Get applications related to these opportunities
    const applications = await Application.find({
      opportunity: { $in: opportunityIds }
    })
      .populate('volunteer', 'name email skills')
      .populate('opportunity', 'title description location status required_skills')
      .sort({ createdAt: -1 });

    res.status(200).json({ applications });
  } catch (error) {
    console.error('Get NGO Apps Error:', error);
    res.status(500).json({ error: 'Server error while fetching NGO applications' });
  }
};

/**
 * @desc    Update an application's status (accept/reject)
 * @route   PUT /api/applications/:id
 * @access  Private (NGO only)
 */
module.exports.updateApplicationStatus = async (req, res) => {
  try {
    if (req.user.role !== 'ngo') {
      return res.status(403).json({ error: 'Forbidden: Not authorized.' });
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be "accepted" or "rejected".' });
    }

    const application = await Application.findById(id).populate('opportunity');
    if (!application) {
      return res.status(404).json({ error: 'Application not found.' });
    }

    
    if (application.opportunity.ngo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Forbidden: You do not have permission to update this application.' });
    }

    application.status = status;
    await application.save();

    if(status=='accepted'){
      try{
        const oppurtunityTitle=application.opportunity.title;
        const welcomemsg=`Congratulations! your application for "${oppurtunityTitle}" has been accepted`;
        await Message.create({
          sender_id:req.user._id,
          receiver_id:application.volunteer,
          content:welcomemsg
        });
      }
      catch(msgError){
        console.error("Failed to send welcome msg",msgError);
      }
    }

    const updatedApp = await application.populate([
      { path: 'volunteer', select: 'name email' },
      { path: 'opportunity', select: 'title required_skills' }
    ]);

    res.status(200).json({
      message: `Application ${status} successfully`,
      application: updatedApp
    });
  } catch (error) {
    console.error('Update App Status Error:', error);
    res.status(500).json({ error: 'Server error while updating status' });
  }
};
