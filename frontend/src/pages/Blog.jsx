import React from 'react'
import { useEffect, useState } from 'react'
import { getPosts } from '../services/api'
import { Link } from 'react-router-dom';

function Blog() {
  const [posts, setPosts] = useState([]);
  const strapiBaseUrl = 'http://localhost:1337';

  useEffect(() => {
    const fetchData = async () => {
        try {
            const data = await getPosts();
            console.log(data);
            setPosts(data);
        } catch (error) {
            console.error("Error fetching posts:", error);
            <h1>Error Fetching data ${error}</h1>
        }
    };
    fetchData();
}, []);

  return (
    <div className="container mx-auto p-4 min-h-screen">
            <h1 className="text-3xl font-bold mb-4">Posts</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {posts.map((post) => (
                    <div key={post.id} className="bg-white p-4 shadow-md rounded">
                        <Link to={`/blog/${post.slug}`}>
                            {post.coverImage && (
                                <img
                                src={`${strapiBaseUrl}${post.coverImage.url}`}
                                    alt={`Portada de ${post.Title}`}
                                    className="w-full h-32 object-cover mb-2 rounded" // Estilos para la miniatura
                                />
                            )}
                            <h2 className="text-xl font-semibold">{post.Title}</h2>
                            <p>{post.content.substring(0, 50)}...</p> {/* Preview del contenido */}
                        </Link>
                    </div>
                ))}
            </div>
        </div>
  )
}

export default Blog;  