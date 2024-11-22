import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Tag } from 'lucide-react';

const BLOG_POSTS = [
  {
    id: '1',
    title: 'The Science Behind Sleep Tracking',
    slug: 'science-behind-sleep-tracking',
    excerpt: 'Understanding how sleep tracking can improve your rest and overall health...',
    content: '',
    publishDate: '2024-03-15',
    readTime: 5,
    category: 'Science',
    imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800'
  },
  // Add more blog posts here
];

const Blog = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Sleep Journal Blog</h1>
        
        <div className="grid gap-8">
          {BLOG_POSTS.map((post) => (
            <article key={post.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="md:flex">
                <div className="md:flex-shrink-0">
                  <img
                    className="h-48 w-full object-cover md:w-48"
                    src={post.imageUrl}
                    alt={post.title}
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{post.readTime} min read</span>
                    <span className="mx-2">•</span>
                    <Tag className="w-4 h-4 mr-1" />
                    <span>{post.category}</span>
                  </div>
                  <Link 
                    to={`/blog/${post.slug}`}
                    className="block mt-2"
                  >
                    <h2 className="text-xl font-semibold text-gray-900 hover:text-indigo-600">
                      {post.title}
                    </h2>
                  </Link>
                  <p className="mt-3 text-gray-600">
                    {post.excerpt}
                  </p>
                  <div className="mt-4">
                    <Link
                      to={`/blog/${post.slug}`}
                      className="text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      Read more →
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;