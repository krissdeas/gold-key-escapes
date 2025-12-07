const fs = require('fs');
const path = require('path');
const fm = require('front-matter');
const { marked } = require('marked');

const postsDir = './posts';
const outputFile = './data/posts.json';

if (!fs.existsSync('./data')) fs.mkdirSync('./data', { recursive: true });
if (!fs.existsSync(postsDir)) fs.mkdirSync(postsDir, { recursive: true });

let posts = [];
try {
    const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
    posts = files.map(file => {
        const content = fs.readFileSync(path.join(postsDir, file), 'utf8');
        const parsed = fm(content);
        const date = parsed.attributes.date ? new Date(parsed.attributes.date) : new Date();
        return {
            id: Date.parse(date) || Date.now(),
            slug: file.replace('.md', ''),
            title: parsed.attributes.title || 'Untitled',
            category: parsed.attributes.category || 'Travel Tips',
            date: date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            readTime: parsed.attributes.readTime || '5 min read',
            excerpt: parsed.attributes.excerpt || '',
            image: parsed.attributes.image || null,
            content: marked.parse(parsed.body)
        };
    });
    posts.sort((a, b) => b.id - a.id);
    console.log(`Processed ${posts.length} post(s)`);
} catch (err) {
    console.log('No posts yet');
}
fs.writeFileSync(outputFile, JSON.stringify(posts, null, 2));
console.log('Generated posts.json');
