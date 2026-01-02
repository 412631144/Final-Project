const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Post = require('./models/Post');

dotenv.config();

const samples = [
    { title: '早安', imageUrl: '/public/images/早安.jpg', category: '早安', description: '早安！美好的一天開始了！' },
    { title: '晚安', imageUrl: '/public/images/晚安.png', category: '晚安', description: '晚安，祝你好夢！' },
    { title: '平安喜樂', imageUrl: '/public/images/平安喜樂.png', category: '勸世', description: '願心中充滿平安與喜樂。' },
    { title: '勸世', imageUrl: '/public/images/勸世.png', category: '勸世', description: '莫生氣，人生就像一場戲。' },
    { title: '節慶', imageUrl: '/public/images/節慶.jpg', category: '節慶', description: '佳節愉快！' }
];

const seedData = async () => {
    try {
        // 1. Seed Admin
        const adminEmail = 'admin@example.com';
        const adminExists = await User.findOne({ email: adminEmail });

        let adminUser;
        if (!adminExists) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin', salt);
            adminUser = await User.create({
                name: '站長',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin'
            });
        } else {
            adminUser = adminExists;
        }

        // 2. Seed Posts
        const count = await Post.countDocuments();
        if (count === 0 && adminUser) {
            const samplePosts = samples.map(s => ({
                ...s,
                creatorId: adminUser._id,
                creatorName: adminUser.name
            }));
            await Post.insertMany(samplePosts);
        } else {
        }

    } catch (error) {
        console.error(`Seeding Error: ${error.message}`);
    }
};

// Standalone execution support
if (process.argv.includes('--standalone')) {
    const connectDB = require('./config/db');
    connectDB().then(async () => {
        await seedData();
        process.exit();
    });
}

module.exports = seedData;
