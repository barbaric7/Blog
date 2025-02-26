class Auth {
  constructor() {
    this.currentUser = null;
    this.checkSession();
  }

  checkSession() {
    const session = localStorage.getItem('blog_session');
    if (session) {
      try {
        this.currentUser = JSON.parse(session);
      } catch (error) {
        this.currentUser = null;
      }
    }
  }

  async login(email, password) {
    // In a real app, you'd want to hash the password
    if (email === 'admin@blog.com' && password === 'Admin123!') {
      this.currentUser = { email };
      localStorage.setItem('blog_session', JSON.stringify(this.currentUser));
      return true;
    }
    return false;
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('blog_session');
  }

  isAuthenticated() {
    return !!this.currentUser;
  }
}

export const auth = new Auth();