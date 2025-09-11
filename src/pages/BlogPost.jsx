import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import client from '../lib/sanityClient';
import { PortableText } from '@portabletext/react';
import urlFor from '../lib/urlFor';

export default function BlogPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError(null);

    const GROQ = `*[_type == "post" && (_id == $id || slug.current == $id)][0]{
      _id,
      title,
      excerpt,
      "date": publishedAt,
      readingTime,
      tags,
      "featuredImage": featuredImage{
        "asset": asset->{_id, url, metadata},
        alt,
        caption
      },
      "authors": authors[]{
        _key,
        "author": author->{
          _id,
          name,
          image,
          bio
        }
      },
      content
    }`;

    client
      .fetch(GROQ, { id })
      .then((data) => {
        if (!data) throw new Error('Post not found');
        setPost(data);
      })
      .catch((err) => setError(err.message || 'Failed to load post'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="p-6 max-w-3xl mx-auto">
      <p className="text-center">Loading post…</p>
    </div>
  );

  if (error) return (
    <div className="p-6 max-w-3xl mx-auto">
      <p className="text-red-600 text-center">{error}</p>
      <div className="text-center mt-4">
        <Link to="/blogs" className="underline">Back to blogs</Link>
      </div>
    </div>
  );

  const renderAuthors = (authors) => {
    if (!authors || !authors.length) return null;
    return (
      <div className="mt-6 space-y-4">
        <h3 className="text-lg font-semibold">About the Author{authors.length > 1 ? 's' : ''}</h3>
        {authors.map((a) => (
          <div key={a._id || a._key} className="flex items-start gap-4 border rounded-lg p-4 bg-gray-50">
            {a.author?.image && (
              <img
                src={urlFor(a.author.image).width(64).height(64).url()}
                alt={a.author.name || 'author'}
                className="w-16 h-16 rounded-full object-cover"
              />
            )}
            <div>
              <div className="font-medium text-base">{a.author?.name}</div>
              {a.author?.bio && (
                <p className="text-sm text-gray-600 mt-1">{a.author.bio}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <article className="prose lg:prose-lg max-w-3xl mx-auto p-6">
      {post.featuredImage && post.featuredImage.asset && (
        <img
          src={post.featuredImage.asset.url || (post.featuredImage && urlFor(post.featuredImage).url())}
          alt={post.featuredImage.alt || post.title}
          className="w-full rounded-lg mb-6 object-cover"
        />
      )}

      <h1 className="text-3xl font-semibold">{post.title}</h1>

      <div className="flex items-center justify-between text-sm text-gray-600 mt-2">
        <div>{post.date && <span>{new Date(post.date).toLocaleDateString()}</span>}</div>
        <div>
          {post.readingTime && <span className="ml-2">{post.readingTime} min read</span>}
        </div>
      </div>

      {post.excerpt && <p className="mt-4 text-gray-700">{post.excerpt}</p>}

      <section className="mt-6">
        <PortableText value={post.content} />
      </section>

      {renderAuthors(post.authors)}

      {post.tags && post.tags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {post.tags.map((t) => (
            <span key={t} className="text-xs px-2 py-1 border rounded">{t}</span>
          ))}
        </div>
      )}

      <div className="mt-10">
        <Link to="/blogs" className="underline">← Back to blogs</Link>
      </div>
    </article>
  );
}