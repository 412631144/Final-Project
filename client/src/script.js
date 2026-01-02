const API_URL = 'http://localhost:5000/api/posts';
const AUTH_URL = 'http://localhost:5000/api/users';
const APP_URL_PREFIX = 'http://localhost:5000/';

let currentUser = null; // Object with _id, name, email, token
let currentView = 'all';
let currentCategoryFilter = null;
let postsData = [];

// ==========================================
// API Calls
// ==========================================

function getAuthHeader() {
    if (currentUser && currentUser.token) {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentUser.token}`
        };
    }
    return { 'Content-Type': 'application/json' };
}

async function fetchPosts() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        postsData = data;

        // Fix image paths
        postsData = postsData.map(post => {
            if (post.imageUrl.includes('public/images/')) {
                return {
                    ...post,
                    imageUrl: `${APP_URL_PREFIX}${post.imageUrl}`
                };
            }
            return post;
        });

        renderList();
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

async function loginApi(email, password) {
    try {
        const response = await fetch(`${AUTH_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || '登入失敗');
        }

        return data; // contains user info and token
    } catch (error) {
        alert(error.message);
        return null;
    }
}

async function registerApi(name, email, password) {
    try {
        const response = await fetch(`${AUTH_URL}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || '註冊失敗');
        }

        return data;
    } catch (error) {
        alert(error.message);
        return null;
    }
}

async function createPostApi(newPost) {
    if (!currentUser) return alert('請先登入');
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: getAuthHeader(),
            body: JSON.stringify(newPost)
        });
        if (response.ok) {
            fetchPosts();
        } else {
            const err = await response.json();
            alert(err.message);
        }
    } catch (error) {
        console.error('Error creating post:', error);
    }
}

async function updatePostApi(id, updatedPost) {
    if (!currentUser) return alert('請先登入');
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: getAuthHeader(),
            body: JSON.stringify(updatedPost)
        });
        if (response.ok) {
            fetchPosts();
        } else {
            const err = await response.json();
            alert(err.message);
        }
    } catch (error) {
        console.error('Error updating post:', error);
    }
}

async function deletePostApi(id) {
    if (!currentUser) return alert('請先登入');
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: getAuthHeader()
        });
        if (response.ok) {
            fetchPosts();
        } else {
            const err = await response.json();
            alert(`刪除失敗: ${err.message}`);
        }
    } catch (error) {
        console.error('Error deleting post:', error);
    }
}

async function likePostApi(id) {
    if (!currentUser) return alert('請先登入才能按讚！');
    try {
        const response = await fetch(`${API_URL}/${id}/like`, {
            method: 'PUT',
            headers: getAuthHeader()
        });
        if (response.ok) {
            fetchPosts();
        }
    } catch (error) {
        console.error('Error liking post:', error);
    }
}

async function collectPostApi(id) {
    if (!currentUser) return alert('請先登入才能收藏！');
    try {
        const response = await fetch(`${API_URL}/${id}/collect`, {
            method: 'PUT',
            headers: getAuthHeader()
        });
        if (response.ok) {
            fetchPosts();
        }
    } catch (error) {
        console.error('Error collecting post:', error);
    }
}

// ==========================================
// UI Logic
// ==========================================

async function performLogin() {
    const emailInput = document.querySelector('#loginModal input[type="email"]');
    const passInput = document.querySelector('#loginModal input[type="password"]');

    const user = await loginApi(emailInput.value, passInput.value);

    if (user) {
        currentUser = user;
        // Mock avatar if no avatar from backend yet (Backwards compat)
        if (!currentUser.avatar) currentUser.avatar = `https://ui-avatars.com/api/?name=${currentUser.name}&background=random`;

        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
        updateUIState();
        fetchPosts();
    }
}

async function performRegister() {
    // Assuming register modal has inputs with IDs
    // Check if we need to modify HTML or select by structure
    // Let's assume standard layout or use IDs if I set them. 
    // Wait, the index.html didn't explicitly have register modal form inside?
    // Let's check `index.html` structure or dynamically create if missing.
    // The previous index.html code had a Register button pointing to #registerModal but I didn't create the modal body in detail?
    // Let's assume there is a #registerModal. 
    // Actually, looking at previous recreation, I might have missed the #registerModal body content!
    // I only made #loginModal and #editorModal.
    // I need to update index.html to include register modal or use JS to inject it.
    // For now, let's just assume I will fix index.html or reuse login modal logic?
    // No, better to have a register modal.

    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const pass = document.getElementById('regPass').value;

    const user = await registerApi(name, email, pass);
    if (user) {
        currentUser = user;
        if (!currentUser.avatar) currentUser.avatar = `https://ui-avatars.com/api/?name=${currentUser.name}&background=random`;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        bootstrap.Modal.getInstance(document.getElementById('registerModal')).hide();
        updateUIState();
        fetchPosts();
    }
}

function logout() {
    currentUser = null;
    currentView = 'all';
    currentCategoryFilter = null;
    localStorage.removeItem('currentUser');

    // Clear login inputs
    const emailInput = document.querySelector('#loginModal input[type="email"]');
    const passInput = document.querySelector('#loginModal input[type="password"]');
    if (emailInput) emailInput.value = '';
    if (passInput) passInput.value = '';

    updateUIState();
    renderList();
}

function updateUIState() {
    const navGuest = document.getElementById('nav-guest');
    const navUser = document.getElementById('nav-user');
    const addBtn = document.getElementById('addBtn');
    const guestAlert = document.getElementById('guest-alert');
    const userNameDisplay = document.getElementById('user-name-display');
    const userAvatarImg = document.getElementById('user-avatar-img');

    if (currentUser) {
        navGuest.classList.add('d-none');
        navUser.classList.remove('d-none');
        addBtn.style.display = 'flex';
        guestAlert.style.display = 'none';
        userNameDisplay.innerText = `${currentUser.name} (${currentUser.role || 'user'})`;
        userAvatarImg.src = currentUser.avatar;
    } else {
        navGuest.classList.remove('d-none');
        navUser.classList.add('d-none');
        addBtn.style.display = 'none';
        guestAlert.style.display = 'block';
    }
}

function filterCategory(category) {
    currentView = 'category';
    currentCategoryFilter = category;
    document.querySelectorAll('.sidebar-menu .list-group-item').forEach(el => el.classList.remove('active'));
    document.getElementById('page-title').innerText = `${category}系列`;
    document.getElementById('btn-back-all').classList.remove('d-none');
    renderList();
}

function showFilteredList(type) {
    currentView = type;
    currentCategoryFilter = null;
    const pageTitle = document.getElementById('page-title');
    const backBtn = document.getElementById('btn-back-all');
    document.querySelectorAll('.sidebar-menu .list-group-item').forEach(el => el.classList.remove('active'));
    if (type === 'all') document.querySelector('.sidebar-menu .list-group-item:first-child').classList.add('active');

    if (type === 'collections') {
        if (!currentUser) return alert('請先登入');
        pageTitle.innerText = "我的收藏";
        backBtn.classList.remove('d-none');
    } else if (type === 'likes') {
        if (!currentUser) return alert('請先登入');
        pageTitle.innerText = "按讚紀錄";
        backBtn.classList.remove('d-none');
    } else if (type === 'my-creations') {
        if (!currentUser) return alert('請先登入');
        pageTitle.innerText = "我的作品";
        backBtn.classList.remove('d-none');
    } else {
        pageTitle.innerText = "精選長輩圖";
        backBtn.classList.add('d-none');
    }
    renderList();
}

function renderList() {
    const listContainer = document.getElementById('greeting-list');
    const totalCountBadge = document.getElementById('total-count');
    listContainer.innerHTML = '';

    let displayData = postsData;

    if (currentView === 'category' && currentCategoryFilter) {
        displayData = postsData.filter(d => d.category === currentCategoryFilter);
    } else if (currentUser) {
        if (currentView === 'likes') {
            displayData = postsData.filter(d => d.likesBy && d.likesBy.includes(currentUser._id));
        } else if (currentView === 'my-creations') {
            displayData = postsData.filter(d => d.creatorId === currentUser._id || d.creatorId === currentUser.id); // Check both for compat
        } else if (currentView === 'collections') {
            displayData = postsData.filter(d => d.collectedBy && d.collectedBy.includes(currentUser._id));
        }
    }

    if (displayData.length === 0) {
        let emptyMsg = "這裡空空如也...";
        listContainer.innerHTML = `
            <div class="col-12 text-center text-muted py-5">
                <i class="fas fa-folder-open fa-3x opacity-25"></i>
                <p class="lead mt-3">${emptyMsg}</p>
            </div>`;
        totalCountBadge.innerText = '0 筆';
        return;
    }

    displayData.forEach(item => {
        const isOwner = currentUser && (item.creatorId === currentUser._id || item.creatorId === currentUser.id);
        const isAdmin = currentUser && currentUser.role === 'admin';
        const canEdit = isOwner || isAdmin;

        // Debug Log
        if (currentUser && currentUser.role === 'admin' && !canEdit) {
            console.log(`Admin permission check failed for post ${item._id}. UserRole: ${currentUser.role}, Creator: ${item.creatorId}`);
        }

        const isLiked = currentUser && item.likesBy && item.likesBy.includes(currentUser._id);
        const isCollected = currentUser && item.collectedBy && item.collectedBy.includes(currentUser._id);

        let interactionHtml = '';
        if (currentUser) {
            const likeClass = isLiked ? 'liked' : 'text-action-default';
            const collectClass = isCollected ? 'collected' : 'text-action-default';

            interactionHtml = `
                <div class="d-flex gap-3 align-items-center">
                    <i class="fas fa-download action-btn text-action-default" title="下載" onclick="downloadImage('${item.imageUrl}', '${item.title}')"></i>
                    <i class="fas fa-heart action-btn ${likeClass}" title="讚" onclick="likePostApi('${item._id}')"></i>
                    <i class="fas fa-bookmark action-btn ${collectClass}" title="收藏" onclick="collectPostApi('${item._id}')"></i>
                </div>
            `;
        } else {
            interactionHtml = `
                <div class="d-flex gap-3 align-items-center">
                    <i class="fas fa-download action-btn text-action-default" title="下載" onclick="downloadImage('${item.imageUrl}', '${item.title}')"></i>
                    <i class="fas fa-heart action-btn text-action-default" title="請先登入" onclick="alert('請先登入')"></i>
                </div>
            `;
        }

        const ownerActions = canEdit ? `
            <div class="dropdown ms-2">
                <button class="btn btn-sm btn-light rounded-circle shadow-sm" data-bs-toggle="dropdown"><i class="fas fa-ellipsis-v text-muted"></i></button>
                <ul class="dropdown-menu dropdown-menu-end border-0 shadow">
                    <li><a class="dropdown-item" href="#" onclick="editData('${item._id}')"><i class="fas fa-edit me-2"></i>編輯</a></li>
                    <li><a class="dropdown-item text-danger" href="#" onclick="deleteData('${item._id}')"><i class="fas fa-trash-alt me-2"></i>刪除</a></li>
                </ul>
            </div>
        ` : '';

        const myBadge = isOwner ? `<span class="badge bg-primary position-absolute top-0 start-0 m-3 shadow">我的作品</span>` : '';

        const cardHtml = `
            <div class="masonry-item">
                <div class="card">
                    <div class="position-relative">
                        <img src="${item.imageUrl}" class="card-img-top" onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'">
                        <span class="card-category-badge">${item.category}</span>
                        ${myBadge}
                    </div>
                    <div class="card-body d-flex flex-column pt-3">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h5 class="card-title text-truncate fw-bold text-dark mb-0" style="max-width: 80%;">${item.title}</h5>
                            ${ownerActions}
                        </div>
                        <p class="card-text text-secondary small flex-grow-1" style="line-height: 1.6;">
                            ${item.description}
                        </p>
                        
                        <div class="d-flex justify-content-between align-items-center mt-3 pt-3 border-top border-light">
                            <div class="d-flex align-items-center">
                                <div class="bg-light rounded-circle p-1 me-2 d-flex align-items-center justify-content-center" style="width:24px;height:24px;">
                                    <i class="fas fa-user text-secondary" style="font-size: 12px;"></i>
                                </div>
                                <small class="text-muted">${item.creatorName}</small>
                            </div>
                            ${interactionHtml}
                        </div>
                        <div class="mt-2 text-end">
                             <small class="text-muted" style="font-size: 0.75rem;"><i class="fas fa-heart text-danger me-1"></i>${item.likes} 人喜歡</small>
                        </div>
                    </div>
                </div>
            </div>
        `;
        listContainer.innerHTML += cardHtml;
    });
    totalCountBadge.innerText = `共 ${displayData.length} 筆`;
}

function downloadImage(url, title) {
    const link = document.createElement('a');
    link.href = url;
    link.download = title;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

const editorModal = new bootstrap.Modal(document.getElementById('editorModal'));

function prepareCreateMode() {
    if (!currentUser) return alert("請先登入！");
    document.getElementById('modalTitle').innerText = "新增長輩圖";
    document.getElementById('greetingForm').reset();
    document.getElementById('editId').value = "";
}

function saveData() {
    const title = document.getElementById('inputTitle').value;
    const imageUrl = document.getElementById('inputImageUrl').value;
    const category = document.getElementById('inputCategory').value;
    const description = document.getElementById('inputDescription').value;

    const newPost = {
        title,
        imageUrl,
        category,
        description,
        creatorId: currentUser._id,
        creatorName: currentUser.name
    };

    const editId = document.getElementById('editId').value;

    if (editId) {
        updatePostApi(editId, newPost);
    } else {
        createPostApi(newPost);
    }

    editorModal.hide();
}

function editData(id) {
    const post = postsData.find(p => p._id === id);
    if (!post) return;

    document.getElementById('modalTitle').innerText = "編輯長輩圖";
    document.getElementById('inputTitle').value = post.title;
    document.getElementById('inputImageUrl').value = post.imageUrl;
    document.getElementById('inputCategory').value = post.category;
    document.getElementById('inputDescription').value = post.description || '';
    document.getElementById('editId').value = post._id;

    editorModal.show();
}

function deleteData(id) {
    if (confirm("確定刪除？")) {
        deletePostApi(id);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        // Refresh user data (especially role) from server
        try {
            const res = await fetch(`${AUTH_URL}/me`, {
                headers: getAuthHeader()
            });
            if (res.ok) {
                const refreshedUser = await res.json();
                // Merge token from local storage (since /me doesn't return token)
                currentUser = { ...refreshedUser, token: currentUser.token };
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
            } else {
                // Token invalid or expired
                currentUser = null;
                localStorage.removeItem('currentUser');
            }
        } catch (e) {
            console.error("Failed to refresh user", e);
        }
    }
    updateUIState();
    fetchPosts();
});
