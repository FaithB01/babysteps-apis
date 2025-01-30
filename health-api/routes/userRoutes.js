const express = require('express');
const { registerUser, loginUser, getUserProfile,updateUserProfile,requestPasswordReset,resetPassword  } = require('../controllers/userController');
// const authMiddleware = require("../middleware/authMiddleware");
const { handleAdminAction } = require('../controllers/handleAdminAction'); 
const router = express.Router();

router.post('/register',registerUser );
router.post('/login', loginUser);
router.put('/profile', updateUserProfile);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);
router.get("/profile",  getUserProfile);


// **********************************************2. Health Data APIs*********************************************************//
//(a) Data Collection API
router.post('/health-data/collect', async (req, res) => {
    try {
        const { userId, healthMetrics } = req.body;

        if (!userId || !healthMetrics) {
            return res.status(400).json({ error: 'Invalid request data' });
        }

        const newHealthData = new HealthData({
            userId,
            healthMetrics,
            timestamp: new Date()
        });

        await newHealthData.save();
        res.status(201).json({ message: 'Health data collected successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error collecting health data' });
    }
});

// (b) Health Insights API
router.get('/health-data/insights', async (req, res) => {
    try {
        const insights = await generateHealthInsights(); // Placeholder function for AI model

        res.status(200).json({ insights });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching health insights' });
    }
});
//(c) Health History API
router.get('/health-data/history/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const history = await HealthData.find({ userId }).sort({ timestamp: -1 });

        res.status(200).json({ history });
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving health history' });
    }
});
//*****************************************************3.Device intergration */
//(a) Device Data Sync API
router.post('/device-data/sync', async (req, res) => {
    try {
        const { deviceId, data } = req.body;

        if (!deviceId || !data) {
            return res.status(400).json({ error: 'Device ID and data are required' });
        }

        const syncedData = new DeviceData({
            deviceId,
            data,
            syncedAt: new Date()
        });

        await syncedData.save();
        res.status(201).json({ message: 'Device data synced successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error syncing device data' });
    }
});
//(b) Device Status API
router.get('/device/status', async (req, res) => {
    try {
        const { deviceId } = req.query;
        const status = await checkDeviceStatus(deviceId); // Placeholder function

        res.status(200).json({ status });
    } catch (error) {
        res.status(500).json({ error: 'Error checking device status' });
    }
});
//****************************************************4. Recommendation & Notification APIs */
//(a) Risk Prediction API
router.post('/recommendations/risk', async (req, res) => {
    try {
        const { userId, symptoms } = req.body;
        const prediction = await runRiskPredictionModel(userId, symptoms); // Placeholder function

        res.status(200).json({ prediction });
    } catch (error) {
        res.status(500).json({ error: 'Error generating risk prediction' });
    }
});
//(b) Reminder API
router.post('/notifications/reminders', async (req, res) => {
    try {
        const { userId, reminderDetails } = req.body;
        const reminder = new Reminder({
            userId,
            reminderDetails,
            createdAt: new Date()
        });

        await reminder.save();
        res.status(201).json({ message: 'Reminder created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error creating reminder' });
    }
});
//******************************************************5. Content Delivery APIs */
//Educational Content API
router.get('/content/educational', async (req, res) => {
    try {
        const content = await EducationalContent.find();

        res.status(200).json({ content });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching educational content' });
    }
});
//****************************************************************6. Communication APIs */
//messaging api
router.post('/communication/message', async (req, res) => {
    try {
        const { userId, message } = req.body;
        const newMessage = new Message({
            userId,
            message,
            sentAt: new Date()
        });

        await newMessage.save();
        res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error sending message' });
    }
});
//notification api
router.post('/communication/notify', async (req, res) => {
    try {
        const { userId, notification } = req.body;
        const newNotification = new Notification({
            userId,
            notification,
            createdAt: new Date()
        });

        await newNotification.save();
        res.status(201).json({ message: 'Notification sent successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error sending notification' });
    }
});
//*******************************************************7. Analytics and Reporting APIs */
//(a) Usage Metrics API
router.get('/analytics/usage', async (req, res) => {
    try {
        const metrics = await generateUsageMetrics(); // Placeholder function
        res.status(200).json({ metrics });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching usage metrics' });
    }
});
//(b) Report Generation API
router.post('/analytics/report', async (req, res) => {
    try {
        const { reportType, filters } = req.body;
        const report = await generateReport(reportType, filters); // Placeholder function

        res.status(200).json({ report });
    } catch (error) {
        res.status(500).json({ error: 'Error generating report' });
    }
});
//*********************************************************************8. Admin and Partner APIs */
//(a) Admin Management API

router.post('/api/admin-action', async (req, res) => {
    const { action, payload } = req.body;

    try {
        const result = await handleAdminAction(action, payload);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/admin/manage', async (req, res) => {
    try {
        const { action, payload } = req.body;
        const result = await handleAdminAction(action, payload); // Placeholder function

        res.status(200).json({ message: 'Admin action executed successfully', result });
    } catch (error) {
        res.status(500).json({ error: 'Error executing admin action' });
    }
});
//(b) Partner Integration API
router.post('/partner/integrate', async (req, res) => {
    try {
        const { partnerId, integrationDetails } = req.body;
        const integration = new PartnerIntegration({
            partnerId,
            integrationDetails,
            integratedAt: new Date()
        });

        await integration.save();
        res.status(201).json({ message: 'Partner integrated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error integrating partner' });
    }
});


module.exports = router;
