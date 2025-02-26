import { storage } from './js/storage.js';

function fetchPosts() {
  try {
    const posts = storage.getPosts();
    const blogPosts = document.querySelector('.blog-posts');
    blogPosts.innerHTML = '';

    if (posts.length === 0) {
      blogPosts.innerHTML = `
        <article class="blog-post">
          <h2>Welcome to the Blog!</h2>
          <div class="content">No posts yet. Check back soon!</div>
        </article>
      `;
      return;
    }

    posts.forEach(post => {
      const date = new Date(post.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const postElement = document.createElement('article');
      postElement.className = 'blog-post';
      postElement.innerHTML = `
        <h2>${post.title}</h2>
        <div class="date">${date}</div>
        <div class="content">${post.content}</div>
      `;

      blogPosts.appendChild(postElement);
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    document.querySelector('.blog-posts').innerHTML = `
      <article class="blog-post">
        <h2>Error</h2>
        <div class="content">Failed to load blog posts. Please try again later.</div>
      </article>
    `;
  }
}

// Initial load
fetchPosts();