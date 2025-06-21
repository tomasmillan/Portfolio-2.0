// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { getPostBySlug } from '../services/api';

// function PostDetails() {
//     const { slug } = useParams(); // Sin cambios aquí
//     const [post, setPost] = useState(null);
//     const strapiBaseUrl = import.meta.env.VITE_STRAPI_API_URL || "https://portfolio-20-production-96a6.up.railway.app/api";

//     useEffect(() => {
//       console.log("Slug from useParams:", slug); // Agrega esta línea
//         const fetchPost = async () => {
//             try {
//                 const data = await getPostBySlug(slug);
//                 setPost(data);
//             } catch (error) {
//                 console.error("Error fetching post:", error);
//             }
//         };
//         fetchPost();
//     }, [slug]);

//     if (!post) {
//         return <div>Cargando...<span className="loading loading-ring loading-lg"></span></div>;
//     }

//     return (
//         <div className="container mx-auto min-h-screen p-4">
//             <h1 className="text-3xl font-bold mb-4">{post.Title}</h1>
//             {post.coverImage && (
//                 <img
//                     src={`${strapiBaseUrl}${post.coverImage.url}`}
//                     alt={`Portada de ${post.Title}`}
//                     className="w-full h-64 object-cover mb-4 rounded"
//                 />
//             )}
//             <p>{post.content}</p>
//         </div>
//     );
// }

// export default PostDetails;