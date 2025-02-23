const Meeting = require('../../model/schema/meeting');

exports.createMeeting = async (req, res) => {
    try {
        const { title, description, startTime, endTime, participants, location } = req.body;
        
        const meeting = new Meeting({
            title,
            description,
            startTime,
            endTime,
            participants,
            location,
            organizer: req.user.id
        });

        await meeting.save();
        
        res.status(201).json({
            success: true,
            data: meeting
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

exports.getMeetings = async (req, res) => {
    try {
        const meetings = await Meeting.find({ deleted: false })
            .populate('organizer', 'firstName lastName username')
            .populate('participants', 'firstName lastName username');
        
        res.status(200).json({
            success: true,
            data: meetings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get single meeting
exports.getMeeting = async (req, res) => {
    try {
        const meeting = await Meeting.findById(req.params.id)
            .populate('organizer', 'firstName lastName username')
            .populate('participants', 'firstName lastName username');

        if (!meeting || meeting.deleted) {
            return res.status(404).json({
                success: false,
                message: 'Meeting not found'
            });
        }

        res.status(200).json({
            success: true,
            data: meeting
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update meeting
exports.updateMeeting = async (req, res) => {
    try {
        const meeting = await Meeting.findById(req.params.id);

        if (!meeting || meeting.deleted) {
            return res.status(404).json({
                success: false,
                message: 'Meeting not found'
            });
        }

        // Check if user is the organizer
        if (meeting.organizer.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this meeting'
            });
        }

        const updatedMeeting = await Meeting.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: new Date() },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            data: updatedMeeting
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Delete meeting (soft delete)
exports.deleteMeeting = async (req, res) => {
    try {
        const meeting = await Meeting.findById(req.params.id);

        if (!meeting || meeting.deleted) {
            return res.status(404).json({
                success: false,
                message: 'Meeting not found'
            });
        }

        // Check if user is the organizer
        if (meeting.organizer.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this meeting'
            });
        }

        await Meeting.findByIdAndUpdate(req.params.id, { deleted: true });

        res.status(200).json({
            success: true,
            message: 'Meeting deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};