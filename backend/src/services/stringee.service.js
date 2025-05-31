const jwt = require('jsonwebtoken');
const axios = require('axios');

const STRINGEE_SMS_API_URL = 'https://api.stringee.com/v1/sms';
const STRINGEE_VOICE_API_URL = 'https://api.stringee.com/v1/call2/callout';
const STRINGEE_API_KEY_SID = process.env.STRINGEE_API_KEY_SID;
const STRINGEE_API_KEY_SECRET = process.env.STRINGEE_API_KEY_SECRET;
const STRINGEE_SMS_FROM = process.env.STRINGEE_SMS_FROM; // Số điện thoại Stringee cấp cho SMS
const STRINGEE_CALL_FROM = process.env.STRINGEE_CALL_FROM; // Số điện thoại Stringee cấp cho Voice

const generateStringeeToken = () => {
    const header = {
        typ: 'JWT',
        alg: 'HS256',
        cty: 'stringee-api;v=1'
    };

    const payload = {
        jti: `${STRINGEE_API_KEY_SID}_${Date.now()}`,
        iss: STRINGEE_API_KEY_SID,
        exp: Math.floor(Date.now() / 1000) + 3600, // Hết hạn sau 1 giờ
        rest_api: true
    };

    return jwt.sign(payload, STRINGEE_API_KEY_SECRET, {
        header
    });
};

const sendSMS = async (to, message) => {
    try {
        console.log('Environment check:', {
            STRINGEE_SMS_FROM,
            STRINGEE_API_KEY_SID,
            to,
            message
        }); // Debug

        if (!STRINGEE_SMS_FROM) {
            throw new Error('STRINGEE_SMS_FROM is not defined in .env');
        }

        const token = generateStringeeToken();
        const response = await axios.post(STRINGEE_SMS_API_URL, {
            sms: [{
                from: STRINGEE_SMS_FROM,
                to: to,
                text: message
            }]
        }, {
            headers: {
                'Content-Type': 'application/json',
                'X-STRINGEE-AUTH': token
            }
        });

        console.log('Stringee SMS Response:', response); // Debug
        if (response.data.smsSent > 0) {
            return {
                success: true
            };
        } else {
            throw new Error(response.data.result?.[0]?.msg || 'Failed to send SMS');
        }
    } catch (error) {
        console.error('Stringee SMS Error:', error.message, error.response?.data); // Debug
        throw error;
    }
};

const makeVoiceCall = async (to, message) => {
    try {
        const token = generateStringeeToken();
        const response = await axios.post(STRINGEE_VOICE_API_URL, {
            from: {
                type: 'external',
                number: STRINGEE_CALL_FROM,
                alias: STRINGEE_CALL_FROM
            },
            to: [{
                type: 'external',
                number: to,
                alias: to
            }],
            answer_url: 'https://your-webhook-url.com/answer',
            actions: [{
                action: 'talk',
                text: message,
                voice: 'female',
                language: 'vi-VN'
            }]
        }, {
            headers: {
                'Content-Type': 'application/json',
                'X-STRINGEE-AUTH': token
            }
        });

        console.log(message);


        if (response.status === 200) {
            return {
                success: true,
                callId: response.data.callId
            };
        } else {
            throw new Error(response.data.message || 'Failed to make voice call');
        }
    } catch (error) {
        console.error('Stringee Voice Error:', error.message);
        throw error;
    }
};

module.exports = { sendSMS, makeVoiceCall };