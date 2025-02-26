import { auth } from './js/auth.js';
import { storage } from './js/storage.js';

const loginForm = document.getElementById('login');
const adminPanel = document.getElementById('admin-panel');
const loginFormContainer = document.getElementById('login-form');
const logoutBtn = document.getElementById('logout-btn');
const newPostBtn = document.getElementById('new-post-btn');
const postEditor = document.getElementById('post-editor');
const postForm = document.getElementById('post-form');
const postTitleInput = document.getElementById('post-title');
const postContentInput = document.getElementById('post-content');

let currentEditId = null;

// Check if user is already logged in
if (auth.isAuthenticated()) {
  showAdminPanel();
} else {
  showLoginForm();
}

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const success = await auth.login(email, password);
    if (success) {
      showAdminPanel();
    } else {
      throw new Error('Invalid credentials');
    }
  } catch (error) {
    alert('Login failed: ' + error.message);
  }
});

logoutBtn.addEventListener('click', () => {
  auth.logout();
  showLoginForm();
});

newPostBtn.addEventListener('click', () => {
  currentEditId = null;
  postForm.reset();
  document.querySelector('#post-editor h2').textContent = 'Create New Post';
  postEditor.classList.remove('hidden');
});

postForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = postTitleInput.value;
  const content = postContentInput.value;

  try {
    if (currentEditId) {
      // Update existing post
      const updated = storage.updatePost(currentEditId, { title, content });
      if (!updated) throw new Error('Post not found');
      alert('Post updated successfully!');
    } else {
      // Create new post
      storage.addPost({ title, content });
      alert('Post created successfully!');
    }

    postForm.reset();
    postEditor.classList.add('hidden');
    fetchAdminPosts();
  } catch (error) {
    alert(currentEditId ? 'Failed to update post: ' : 'Failed to create post: ' + error.message);
  }
});

function fetchAdminPosts() {
  try {
    const posts = storage.getPosts();
    const postsList = document.getElementById('posts-list');
    postsList.innerHTML = '<h2>Your Posts</h2>';

    posts.forEach(post => {
      const date = new Date(post.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const postElement = document.createElement('article');
      postElement.className = 'blog-post';
      postElement.innerHTML = `
        <h3>${post.title}</h3>
        <div class="date">${date}</div>
        <div class="content">${post.content}</div>
        <div class="post-actions">
          <button onclick="editPost('${post.id}')">Edit</button>
          <button onclick="deletePost('${post.id}')" class="delete-btn">Delete</button>
        </div>
      `;

      postsList.appendChild(postElement);
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
  }
}

// Make editPost and deletePost available globally
window.editPost = (postId) => {
  try {
    const post = storage.getPost(postId);
    if (!post) throw new Error('Post not found');

    currentEditId = postId;
    postTitleInput.value = post.title;
    postContentInput.value = post.content;
    document.querySelector('#post-editor h2').textContent = 'Edit Post';
    postEditor.classList.remove('hidden');
  } catch (error) {
    alert('Error loading post: ' + error.message);
  }
};

window.deletePost = (postId) => {
  if (!confirm('Are you sure you want to delete this post?')) return;

  try {
    const success = storage.deletePost(postId);
    if (!success) throw new Error('Post not found');
    
    alert('Post deleted successfully!');
    fetchAdminPosts();
  } catch (error) {
    alert('Error deleting post: ' + error.message);
  }
};

function showAdminPanel() {
  loginFormContainer.classList.add('hidden');
  adminPanel.classList.remove('hidden');
  logoutBtn.classList.remove('hidden');
  fetchAdminPosts();
}

function showLoginForm() {
  loginFormContainer.classList.remove('hidden');
  adminPanel.classList.add('hidden');
  logoutBtn.classList.add('hidden');
}