const User = require('../models/user.js');
const Application = require('../models/application.js');
const Opportunity = require('../models/opportunity.js');
const cloudinary = require('cloudinary').v2; 

exports.getUserProfile = async (req, res) => {
  try {
    const profile = await User.findById(req.user._id).select('-password');
    if (!profile) return res.status(404).json({ error: 'User profile not found' });
    res.status(200).json(profile);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ error: "Failed to fetch profile." });
  }
};


// controllers/user.controller.js

exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { name, location, bio, skills } = req.body;

    if (name) user.name = name;
    if (location) user.location = location;
    if (bio) user.bio = bio;
    if (skills) {
      try {
        user.skills = JSON.parse(skills);
      } catch {
        // ignore parse error
      }
    }

    //  multer-storage-cloudinary gives direct URL in req.file.path
    if (req.file && req.file.path) {
      user.avatarUrl = req.file.path;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user,
    });

  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};





module.exports.getVolunteerDashboard = async(req,res) => {
    try{
        if(req.user.role!=='volunteer'){
            return res.status(403).json({error:'access restricted'});
        }
        const volunteerId=req.user._id;
        const [applicationCount,acceptedCount,pendingCount,userSkills]=await Promise.all([
            Application.countDocuments({volunteer:volunteerId}),
            Application.countDocuments({volunteer:volunteerId,status:'accepted'}),
            Application.countDocuments({volunteer:volunteerId,status:'pending'}),
            User.findById(volunteerId).select('skills')
        ]);
        const stats={
            applications:applicationCount,
            accepted:acceptedCount,
            pending:pendingCount,
            skills:userSkills.skills?userSkills.skills.length:0
        };
        const opportunities = await Opportunity.find({status:'open'}) 
            .populate('ngo','organization_name')
            .sort({createdAt:-1})
            .limit(3);

        res.status(200).json({stats, opportunities});  
    }catch(error){
         console.error("Get Volunteer Dashboard Error:", error);
        res.status(500).json({ error: 'Server error while fetching dashboard data.' });
    }
};

/**
 * @desc    Get data for the NGO dashboard (stats + recent apps)
 * @route   GET /api/users/dashboard-ngo
 * @access  Private (NGO only)
 */
module.exports.getNgoDashboard = async (req, res) => {
    try {
        if (req.user.role !== 'ngo') {
            return res.status(403).json({ error: 'Forbidden: Access restricted to NGOs.' });
        }

        const ngoId = req.user._id;

        const ngoOpportunities = await Opportunity.find({ ngo: ngoId }).select('_id');
        const opportunityIds = ngoOpportunities.map(opp => opp._id);

        const [
            activeOpportunities,
            applicationsReceived,
            activeVolunteers,
            pendingApplications
        ] = await Promise.all([
            Opportunity.countDocuments({ ngo: ngoId, status: 'open' }),
            Application.countDocuments({ opportunity: { $in: opportunityIds } }),
            Application.distinct('volunteer', { opportunity: { $in: opportunityIds }, status: 'accepted' }).then(users => users.length),
            Application.countDocuments({ opportunity: { $in: opportunityIds }, status: 'pending' })
        ]);

        const stats = {
            activeOpportunities,
            applicationsReceived,
            activeVolunteers,
            pendingApplications
        };

        const recentApplications = await Application.find({ 
            opportunity: { $in: opportunityIds },
            status: 'pending' 
        })
        .populate('volunteer', 'name bio skills') 
        .populate('opportunity', 'title') 
        .sort({ createdAt: -1 }) 
        .limit(5); 

        res.status(200).json({ stats, recentApplications });

    } catch (error) {
        console.error("Get NGO Dashboard Error:", error);
        res.status(500).json({ error: 'Server error while fetching dashboard data.' });
    }
};

exports.removeUserAvatar = async (req, res) => {
  try {
    const user = req.user;

    // Reset to default avatar
    user.avatarUrl = 'https://res.cloudinary.com/df7lfelei/image/upload/v1762711924/346569_anwrqv.png'; 
    await user.save();

    res.json({ message: 'Avatar removed successfully', avatarUrl: user.avatarUrl });
  } catch (error) {
    console.error('Error removing avatar:', error);
    res.status(500).json({ error: 'Failed to remove avatar' });
  }
};


