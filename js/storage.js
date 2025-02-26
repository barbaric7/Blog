// Simple storage utility for managing blog data
class Storage {
  constructor() {
    this.posts = [];
    this.loadPosts();
  }

  loadPosts() {
    try {
      const data = localStorage.getItem('blog_posts');
      this.posts = data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading posts:', error);
      this.posts = [];
    }
  }

  savePosts() {
    try {
      localStorage.setItem('blog_posts', JSON.stringify(this.posts));
    } catch (error) {
      console.error('Error saving posts:', error);
    }
  }

  getPosts() {
    return this.posts;
  }

  addPost(post) {
    const newPost = {
      id: Date.now().toString(),
      title: post.title,
      content: post.content,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.posts.unshift(newPost);
    this.savePosts();
    return newPost;
  }

  updatePost(id, updates) {
    const postIndex = this.posts.findIndex(post => post.id === id);
    if (postIndex === -1) return null;

    this.posts[postIndex] = {
      ...this.posts[postIndex],
      ...updates,
      updated_at: new Date().toISOString()
    };
    this.savePosts();
    return this.posts[postIndex];
  }

  deletePost(id) {
    const postIndex = this.posts.findIndex(post => post.id === id);
    if (postIndex === -1) return false;

    this.posts.splice(postIndex, 1);
    this.savePosts();
    return true;
  }

  getPost(id) {
    return this.posts.find(post => post.id === id);
  }
}

export const storage = new Storage();