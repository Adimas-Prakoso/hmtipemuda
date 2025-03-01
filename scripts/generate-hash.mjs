import bcrypt from 'bcryptjs';

const password = '{[a=p$6/MVw:8Ap';
const saltRounds = 10;

try {
    const hash = await bcrypt.hash(password, saltRounds);
    console.log(`Generated hash for password ${password}:`, hash);
} catch (err) {
    console.error('Error generating hash:', err);
}
