# Examples and Tutorials

Real-world examples and practical tutorials for building with ZenWeb.

## Table of Contents

1. [Todo Application](#todo-application)
2. [Blog with Routing](#blog-with-routing)
3. [User Dashboard](#user-dashboard)
4. [Form Handling](#form-handling)
5. [Data Fetching](#data-fetching)
6. [Authentication](#authentication)
7. [Shopping Cart](#shopping-cart)
8. [Real-Time Updates](#real-time-updates)

---

## Todo Application

A complete todo application with add, delete, and toggle functionality.

```typescript
import { state } from 'zenweb';
import * as UI from 'zenweb';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function TodoApp() {
  const appState = state({
    todos: [] as Todo[],
    newTodo: '',
    filter: 'all' as 'all' | 'active' | 'completed'
  });

  const addTodo = () => {
    if (!appState.newTodo.trim()) return;
    
    appState.todos.push({
      id: Date.now(),
      text: appState.newTodo,
      completed: false
    });
    appState.newTodo = '';
  };

  const toggleTodo = (id: number) => {
    const todo = appState.todos.find(t => t.id === id);
    if (todo) todo.completed = !todo.completed;
  };

  const deleteTodo = (id: number) => {
    appState.todos = appState.todos.filter(t => t.id !== id);
  };

  const filteredTodos = () => {
    if (appState.filter === 'active') {
      return appState.todos.filter(t => !t.completed);
    }
    if (appState.filter === 'completed') {
      return appState.todos.filter(t => t.completed);
    }
    return appState.todos;
  };

  return UI.vbox({
    style: {
      maxWidth: '600px',
      margin: '2rem auto',
      padding: '2rem',
      background: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }
  }, [
    UI.h1({ style: { marginBottom: '2rem' } }, 'Todo List'),
    
    // Add todo form
    UI.hbox({ style: { gap: '0.5rem', marginBottom: '2rem' } }, [
      UI.input({
        placeholder: 'What needs to be done?',
        value: appState.newTodo,
        onInput: (e) => {
          appState.newTodo = (e.target as HTMLInputElement).value;
        },
        onKeyPress: (e) => {
          if (e.key === 'Enter') addTodo();
        },
        style: {
          flex: 1,
          padding: '0.75rem',
          border: '1px solid #ddd',
          borderRadius: '4px'
        }
      }),
      UI.button({
        onClick: addTodo,
        style: {
          padding: '0.75rem 1.5rem',
          background: '#3498db',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }
      }, 'Add')
    ]),
    
    // Filter buttons
    UI.hbox({ style: { gap: '0.5rem', marginBottom: '1rem' } }, [
      UI.button({
        onClick: () => appState.filter = 'all',
        style: {
          padding: '0.5rem 1rem',
          background: appState.filter === 'all' ? '#3498db' : '#ecf0f1',
          color: appState.filter === 'all' ? 'white' : '#333',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }
      }, 'All'),
      UI.button({
        onClick: () => appState.filter = 'active',
        style: {
          padding: '0.5rem 1rem',
          background: appState.filter === 'active' ? '#3498db' : '#ecf0f1',
          color: appState.filter === 'active' ? 'white' : '#333',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }
      }, 'Active'),
      UI.button({
        onClick: () => appState.filter === 'completed',
        style: {
          padding: '0.5rem 1rem',
          background: appState.filter === 'completed' ? '#3498db' : '#ecf0f1',
          color: appState.filter === 'completed' ? 'white' : '#333',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }
      }, 'Completed')
    ]),
    
    // Todo list
    UI.vbox({ style: { gap: '0.5rem' } },
      UI.each(
        filteredTodos,
        (todo) => UI.hbox({
          key: todo.id,
          style: {
            padding: '1rem',
            background: '#f8f9fa',
            borderRadius: '4px',
            alignItems: 'center',
            gap: '1rem'
          }
        }, [
          UI.checkbox({
            checked: todo.completed,
            onChange: () => toggleTodo(todo.id),
            style: { cursor: 'pointer' }
          }),
          UI.text({
            style: {
              flex: 1,
              textDecoration: todo.completed ? 'line-through' : 'none',
              color: todo.completed ? '#999' : '#333'
            }
          }, todo.text),
          UI.button({
            onClick: () => deleteTodo(todo.id),
            style: {
              padding: '0.5rem 1rem',
              background: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }
          }, 'Delete')
        ])
      )
    ),
    
    // Stats
    UI.text({
      style: { marginTop: '1rem', color: '#666' }
    }, () => {
      const active = appState.todos.filter(t => !t.completed).length;
      return `${active} item${active !== 1 ? 's' : ''} left`;
    })
  ]);
}
```

---

## Blog with Routing

A blog application with file-based routing and dynamic posts.

**File**: `src/pages/blog/page.ts`

```typescript
import * as UI from 'zenweb';
import { state, effect } from 'zenweb';

export default function BlogPage() {
  const blogState = state({
    posts: [],
    loading: true
  });

  effect(async () => {
    const response = await fetch('/api/posts');
    blogState.posts = await response.json();
    blogState.loading = false;
  });

  return UI.vbox({
    style: { padding: '2rem', maxWidth: '800px', margin: '0 auto' }
  }, [
    UI.h1({}, 'Blog'),
    
    UI.show(() => blogState.loading,
      UI.RouteLoading({ text: 'Loading posts...' })
    ),
    
    UI.show(() => !blogState.loading,
      UI.vbox({ style: { gap: '2rem' } },
        UI.each(
          () => blogState.posts,
          (post) => UI.card({
            style: {
              padding: '1.5rem',
              cursor: 'pointer'
            },
            onClick: () => {
              window.location.href = `/blog/${post.slug}`;
            }
          }, [
            UI.h2({}, post.title),
            UI.text({ style: { color: '#666', marginTop: '0.5rem' } }, 
              post.excerpt
            ),
            UI.text({ style: { color: '#999', marginTop: '1rem', fontSize: '0.875rem' } },
              new Date(post.date).toLocaleDateString()
            )
          ])
        )
      )
    )
  ]);
}
```

**File**: `src/pages/blog/[slug]/page.ts`

```typescript
import * as UI from 'zenweb';
import { state, effect, RouteContext } from 'zenweb';

export default function BlogPostPage(ctx: RouteContext) {
  const slug = ctx.params.slug;
  
  const postState = state({
    post: null,
    loading: true,
    error: null
  });

  effect(async () => {
    try {
      const response = await fetch(`/api/posts/${slug}`);
      postState.post = await response.json();
    } catch (error) {
      postState.error = error.message;
    } finally {
      postState.loading = false;
    }
  });

  return UI.vbox({
    style: { padding: '2rem', maxWidth: '800px', margin: '0 auto' }
  }, [
    UI.show(() => postState.loading,
      UI.RouteLoading({ text: 'Loading post...' })
    ),
    
    UI.show(() => postState.error,
      UI.vbox({}, [
        UI.h1({}, 'Error'),
        UI.text({}, () => postState.error)
      ])
    ),
    
    UI.show(() => postState.post && !postState.loading,
      UI.vbox({ style: { gap: '1rem' } }, [
        UI.link({ href: '/blog', style: { color: '#3498db' } }, 'Back to Blog'),
        UI.h1({ style: { marginTop: '1rem' } }, () => postState.post?.title),
        UI.text({ style: { color: '#666' } }, 
          () => new Date(postState.post?.date).toLocaleDateString()
        ),
        UI.div({
          style: { marginTop: '2rem', lineHeight: '1.6' },
          innerHTML: () => postState.post?.content
        })
      ])
    )
  ]);
}
```

---

## User Dashboard

Dashboard with authentication and user data.

```typescript
import { state, effect } from 'zenweb';
import * as UI from 'zenweb';

export default function Dashboard() {
  const dashboardState = state({
    user: null,
    stats: {
      views: 0,
      posts: 0,
      followers: 0
    },
    loading: true
  });

  effect(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    try {
      const [userRes, statsRes] = await Promise.all([
        fetch('/api/user', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('/api/stats', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      dashboardState.user = await userRes.json();
      dashboardState.stats = await statsRes.json();
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      dashboardState.loading = false;
    }
  });

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return UI.vbox({
    style: { minHeight: '100vh', background: '#f5f5f5' }
  }, [
    // Header
    UI.header({
      style: {
        padding: '1rem 2rem',
        background: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }
    }, [
      UI.h2({}, 'Dashboard'),
      UI.hbox({ style: { gap: '1rem', alignItems: 'center' } }, [
        UI.text({}, () => dashboardState.user?.name || ''),
        UI.button({
          onClick: logout,
          style: {
            padding: '0.5rem 1rem',
            background: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }
        }, 'Logout')
      ])
    ]),
    
    // Content
    UI.vbox({
      style: { padding: '2rem', maxWidth: '1200px', margin: '0 auto' }
    }, [
      UI.show(() => dashboardState.loading,
        UI.RouteLoading({ text: 'Loading dashboard...' })
      ),
      
      UI.show(() => !dashboardState.loading,
        UI.vbox({ style: { gap: '2rem' } }, [
          // Stats
          UI.grid({
            style: {
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem'
            }
          }, [
            UI.card({
              style: { padding: '1.5rem', textAlign: 'center' }
            }, [
              UI.h3({ style: { color: '#666' } }, 'Total Views'),
              UI.h1({ style: { marginTop: '0.5rem' } }, 
                () => dashboardState.stats.views.toLocaleString()
              )
            ]),
            UI.card({
              style: { padding: '1.5rem', textAlign: 'center' }
            }, [
              UI.h3({ style: { color: '#666' } }, 'Posts'),
              UI.h1({ style: { marginTop: '0.5rem' } }, 
                () => dashboardState.stats.posts.toLocaleString()
              )
            ]),
            UI.card({
              style: { padding: '1.5rem', textAlign: 'center' }
            }, [
              UI.h3({ style: { color: '#666' } }, 'Followers'),
              UI.h1({ style: { marginTop: '0.5rem' } }, 
                () => dashboardState.stats.followers.toLocaleString()
              )
            ])
          ]),
          
          // Recent activity
          UI.card({
            style: { padding: '1.5rem' }
          }, [
            UI.h2({ style: { marginBottom: '1rem' } }, 'Recent Activity'),
            UI.text({}, 'Your recent activity will appear here')
          ])
        ])
      )
    ])
  ]);
}
```

---

## Form Handling

Complete form with validation and submission.

```typescript
import { state } from 'zenweb';
import * as UI from 'zenweb';

export default function ContactForm() {
  const formState = state({
    name: '',
    email: '',
    message: '',
    errors: {},
    submitting: false,
    success: false
  });

  const validate = () => {
    const errors: any = {};
    
    if (!formState.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formState.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formState.message.trim()) {
      errors.message = 'Message is required';
    }
    
    formState.errors = errors;
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    formState.submitting = true;
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          message: formState.message
        })
      });
      
      if (response.ok) {
        formState.success = true;
        formState.name = '';
        formState.email = '';
        formState.message = '';
      }
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      formState.submitting = false;
    }
  };

  return UI.vbox({
    style: {
      maxWidth: '600px',
      margin: '2rem auto',
      padding: '2rem',
      background: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }
  }, [
    UI.h1({ style: { marginBottom: '2rem' } }, 'Contact Us'),
    
    UI.show(() => formState.success,
      UI.vbox({
        style: {
          padding: '1rem',
          background: '#d4edda',
          color: '#155724',
          borderRadius: '4px',
          marginBottom: '1rem'
        }
      }, [
        UI.text({}, 'Thank you! Your message has been sent.')
      ])
    ),
    
    UI.form({
      onSubmit: handleSubmit,
      style: { display: 'flex', flexDirection: 'column', gap: '1rem' }
    }, [
      // Name field
      UI.vbox({ style: { gap: '0.5rem' } }, [
        UI.label({}, 'Name'),
        UI.input({
          value: formState.name,
          onInput: (e) => {
            formState.name = (e.target as HTMLInputElement).value;
          },
          style: {
            padding: '0.75rem',
            border: `1px solid ${formState.errors.name ? '#e74c3c' : '#ddd'}`,
            borderRadius: '4px'
          }
        }),
        UI.show(() => formState.errors.name,
          UI.text({ style: { color: '#e74c3c', fontSize: '0.875rem' } },
            () => formState.errors.name
          )
        )
      ]),
      
      // Email field
      UI.vbox({ style: { gap: '0.5rem' } }, [
        UI.label({}, 'Email'),
        UI.input({
          type: 'email',
          value: formState.email,
          onInput: (e) => {
            formState.email = (e.target as HTMLInputElement).value;
          },
          style: {
            padding: '0.75rem',
            border: `1px solid ${formState.errors.email ? '#e74c3c' : '#ddd'}`,
            borderRadius: '4px'
          }
        }),
        UI.show(() => formState.errors.email,
          UI.text({ style: { color: '#e74c3c', fontSize: '0.875rem' } },
            () => formState.errors.email
          )
        )
      ]),
      
      // Message field
      UI.vbox({ style: { gap: '0.5rem' } }, [
        UI.label({}, 'Message'),
        UI.textarea({
          value: formState.message,
          onInput: (e) => {
            formState.message = (e.target as HTMLTextAreaElement).value;
          },
          style: {
            padding: '0.75rem',
            border: `1px solid ${formState.errors.message ? '#e74c3c' : '#ddd'}`,
            borderRadius: '4px',
            minHeight: '150px',
            resize: 'vertical'
          }
        }),
        UI.show(() => formState.errors.message,
          UI.text({ style: { color: '#e74c3c', fontSize: '0.875rem' } },
            () => formState.errors.message
          )
        )
      ]),
      
      // Submit button
      UI.button({
        type: 'submit',
        disabled: formState.submitting,
        style: {
          padding: '0.75rem 1.5rem',
          background: formState.submitting ? '#95a5a6' : '#3498db',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: formState.submitting ? 'not-allowed' : 'pointer',
          fontSize: '1rem'
        }
      }, () => formState.submitting ? 'Sending...' : 'Send Message')
    ])
  ]);
}
```

---

## Data Fetching

Example of fetching and displaying data from an API.

```typescript
import { state, effect } from 'zenweb';
import * as UI from 'zenweb';

interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
}

export default function UserList() {
  const listState = state({
    users: [] as User[],
    loading: true,
    error: null as string | null,
    page: 1,
    hasMore: true
  });

  const loadUsers = async () => {
    listState.loading = true;
    listState.error = null;
    
    try {
      const response = await fetch(`/api/users?page=${listState.page}`);
      const data = await response.json();
      
      listState.users = [...listState.users, ...data.users];
      listState.hasMore = data.hasMore;
    } catch (error) {
      listState.error = 'Failed to load users';
    } finally {
      listState.loading = false;
    }
  };

  effect(() => {
    loadUsers();
  });

  const loadMore = () => {
    listState.page++;
    loadUsers();
  };

  return UI.vbox({
    style: { padding: '2rem', maxWidth: '800px', margin: '0 auto' }
  }, [
    UI.h1({ style: { marginBottom: '2rem' } }, 'Users'),
    
    UI.show(() => listState.error,
      UI.vbox({
        style: {
          padding: '1rem',
          background: '#f8d7da',
          color: '#721c24',
          borderRadius: '4px',
          marginBottom: '1rem'
        }
      }, [
        UI.text({}, () => listState.error)
      ])
    ),
    
    UI.grid({
      style: {
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '1rem'
      }
    },
      UI.each(
        () => listState.users,
        (user) => UI.card({
          key: user.id,
          style: { padding: '1.5rem', textAlign: 'center' }
        }, [
          UI.avatar({
            src: user.avatar,
            alt: user.name,
            size: '80px',
            style: { marginBottom: '1rem' }
          }),
          UI.h3({}, user.name),
          UI.text({ style: { color: '#666', marginTop: '0.5rem' } }, user.email)
        ])
      )
    ),
    
    UI.show(() => listState.hasMore,
      UI.button({
        onClick: loadMore,
        disabled: listState.loading,
        style: {
          marginTop: '2rem',
          padding: '0.75rem 2rem',
          background: '#3498db',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          alignSelf: 'center'
        }
      }, () => listState.loading ? 'Loading...' : 'Load More')
    )
  ]);
}
```

---

## Summary

These examples demonstrate:
- State management with reactive updates
- Form handling and validation
- Data fetching and loading states
- Routing and navigation
- Authentication patterns
- List rendering and pagination
- Error handling
- Conditional rendering

Use these patterns as starting points for your own applications.
