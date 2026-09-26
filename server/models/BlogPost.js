import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: [{ type: String }],
    readTime: { type: String, default: '5 min read' },
    date: { type: String, required: true },
    author: { type: String, required: true },
    authorRole: { type: String, default: 'Senior Instructor' },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

export const BlogPost = mongoose.model('BlogPost', blogPostSchema);
