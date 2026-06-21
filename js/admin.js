document.addEventListener('DOMContentLoaded', function() {
    awsGetStore();
    const SESSION = 'aws_admin_session';
    const loginView = document.getElementById('adminLogin');
    const dashView = document.getElementById('adminDashboard');

    if (sessionStorage.getItem(SESSION) === '1') showAdmin();

    document.getElementById('adminLoginForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        const user = document.getElementById('adminUser').value.trim();
        const pass = document.getElementById('adminPass').value;
        const err = document.getElementById('adminLoginError');

        if (user === AWSAdminAuth.username && pass === AWSAdminAuth.password) {
            sessionStorage.setItem(SESSION, '1');
            err.classList.remove('show');
            showAdmin();
        } else {
            err.textContent = 'Invalid username or password.';
            err.classList.add('show');
        }
    });

    document.getElementById('adminLogout')?.addEventListener('click', function(e) {
        e.preventDefault();
        sessionStorage.removeItem(SESSION);
        loginView.style.display = 'flex';
        dashView.style.display = 'none';
    });

    initAdminNav();
    initSidebarToggle();
});

function showAdmin() {
    document.getElementById('adminLogin').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';
    renderAll();
}

function renderAll() {
    const store = awsGetStore();
    document.getElementById('admLeads').textContent = store.leads.length;
    document.getElementById('admTrials').textContent = store.posTrials.length;
    document.getElementById('admProjects').textContent = store.projects.length;
    document.getElementById('admTickets').textContent = store.tickets.filter(t => t.status === 'open').length;

    renderLeadsTable(store.leads);
    renderTrialsTable(store.posTrials);
    renderProjectsTable(store.projects);
    renderTicketsAdmin(store.tickets);
    renderClientsTable(store.clients);
    renderNewsletterTable(store.newsletter || []);
}

function renderLeadsTable(leads) {
    const el = document.getElementById('leadsTable');
    if (!leads.length) {
        el.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No leads yet. Contact form submissions appear here.</td></tr>';
        return;
    }
    el.innerHTML = leads.map(l => `
        <tr>
            <td>${l.date}</td>
            <td>${l.name || '—'}</td>
            <td>${l.phone || l.email || '—'}</td>
            <td>${(l.message || l.subject || '—').slice(0, 40)}...</td>
            <td><span class="status-badge ${awsStatusClass(l.status)}">${awsStatusLabel(l.status)}</span></td>
            <td class="admin-actions">
                <button class="btn-dash btn-dash-sm btn-dash-ghost" onclick="adminUpdateStatus('leads','${l.id}','contacted')">Contacted</button>
                <button class="btn-dash btn-dash-sm btn-dash-danger" onclick="adminDeleteItem('leads','${l.id}')">Delete</button>
            </td>
        </tr>
    `).join('');
}

function renderTrialsTable(trials) {
    const el = document.getElementById('trialsTable');
    if (!trials.length) {
        el.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No POS trial requests yet.</td></tr>';
        return;
    }
    el.innerHTML = trials.map(t => `
        <tr>
            <td>${t.date}</td>
            <td>${t.name || '—'}</td>
            <td>${t.restaurant || '—'}</td>
            <td>${t.phone || '—'}</td>
            <td><span class="status-badge ${awsStatusClass(t.status)}">${awsStatusLabel(t.status)}</span></td>
            <td class="admin-actions">
                <button class="btn-dash btn-dash-sm btn-dash-ghost" onclick="adminUpdateStatus('posTrials','${t.id}','contacted')">Contacted</button>
                <button class="btn-dash btn-dash-sm btn-dash-danger" onclick="adminDeleteItem('posTrials','${t.id}')">Delete</button>
            </td>
        </tr>
    `).join('');
}

function renderProjectsTable(projects) {
    const store = awsGetStore();
    const el = document.getElementById('projectsAdminTable');
    el.innerHTML = projects.map(p => {
        const client = store.clients.find(c => c.id === p.clientId);
        return `
        <tr>
            <td>${p.name}</td>
            <td>${client?.company || p.clientId}</td>
            <td><span class="status-badge ${awsStatusClass(p.status)}">${awsStatusLabel(p.status)}</span></td>
            <td>${p.progress}%</td>
            <td class="admin-actions">
                <button class="btn-dash btn-dash-sm btn-dash-ghost" onclick="adminProgress('${p.id}',25)">+25%</button>
                <button class="btn-dash btn-dash-sm btn-dash-primary" onclick="adminComplete('${p.id}')">Complete</button>
            </td>
        </tr>`;
    }).join('');
}

function renderTicketsAdmin(tickets) {
    const store = awsGetStore();
    const el = document.getElementById('ticketsAdminList');
    if (!tickets.length) {
        el.innerHTML = '<div class="empty-state"><i class="fas fa-inbox"></i>No tickets.</div>';
        return;
    }
    el.innerHTML = tickets.map(t => {
        const client = store.clients.find(c => c.id === t.clientId);
        return `
        <div class="dash-panel">
            <div class="d-flex justify-content-between flex-wrap gap-2 mb-2">
                <div><strong>${t.subject}</strong> <span class="small text-muted">— ${client?.name || t.clientId}</span></div>
                <span class="status-badge ${awsStatusClass(t.status)}">${awsStatusLabel(t.status)}</span>
            </div>
            <p class="small">${t.message}</p>
            ${t.reply ? `<p class="small text-success">Replied: ${t.reply}</p>` : `
                <div class="d-flex gap-2 mt-2 flex-wrap">
                    <input type="text" id="reply-${t.id}" class="form-control form-control-sm" placeholder="Type reply..." style="max-width:280px;background:rgba(255,255,255,0.05);border-color:rgba(255,255,255,0.12);color:#fff;">
                    <button class="btn-dash btn-dash-sm btn-dash-primary" onclick="adminReplyTicket('${t.id}')">Send Reply</button>
                </div>
            `}
        </div>`;
    }).join('');
}

function renderClientsTable(clients) {
    document.getElementById('clientsTable').innerHTML = clients.map(c => `
        <tr>
            <td><code>${c.id}</code></td>
            <td>${c.name}</td>
            <td>${c.company}</td>
            <td>${c.phone}</td>
        </tr>
    `).join('');
}

function renderNewsletterTable(subs) {
    const el = document.getElementById('newsletterTable');
    if (!el) return;
    if (!subs.length) {
        el.innerHTML = '<tr><td colspan="4" class="text-center text-muted">No subscribers yet.</td></tr>';
        return;
    }
    el.innerHTML = subs.map(s => `
        <tr>
            <td>${s.date}</td>
            <td>${s.email}</td>
            <td><span class="status-badge badge-done">${s.status}</span></td>
            <td><button class="btn-dash btn-dash-sm btn-dash-danger" onclick="adminDeleteItem('newsletter','${s.id}')">Delete</button></td>
        </tr>
    `).join('');
}

function adminUpdateStatus(collection, id, status) {
    const store = awsGetStore();
    const item = store[collection].find(x => x.id === id);
    if (item) item.status = status;
    awsSaveStore(store);
    renderAll();
}

function adminDeleteItem(collection, id) {
    if (!confirm('Delete this item?')) return;
    const store = awsGetStore();
    store[collection] = store[collection].filter(x => x.id !== id);
    awsSaveStore(store);
    renderAll();
}

function adminProgress(projectId, add) {
    const store = awsGetStore();
    const p = store.projects.find(x => x.id === projectId);
    if (p) {
        p.progress = Math.min(100, p.progress + add);
        p.status = p.progress >= 100 ? 'completed' : 'in-progress';
    }
    awsSaveStore(store);
    renderAll();
}

function adminComplete(projectId) {
    const store = awsGetStore();
    const p = store.projects.find(x => x.id === projectId);
    if (p) { p.progress = 100; p.status = 'completed'; }
    awsSaveStore(store);
    renderAll();
}

function adminReplyTicket(ticketId) {
    const input = document.getElementById('reply-' + ticketId);
    const reply = input?.value.trim();
    if (!reply) return;
    const store = awsGetStore();
    const t = store.tickets.find(x => x.id === ticketId);
    if (t) { t.reply = reply; t.status = 'resolved'; }
    awsSaveStore(store);
    renderAll();
}

function initAdminNav() {
    document.querySelectorAll('[data-admin-tab]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const tab = this.dataset.adminTab;
            document.querySelectorAll('[data-admin-tab]').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            document.querySelectorAll('.dash-tab-content').forEach(t => t.classList.remove('active'));
            document.getElementById('adm-tab-' + tab)?.classList.add('active');
            document.querySelector('.dashboard-sidebar')?.classList.remove('open');
            document.getElementById('sidebarOverlay')?.classList.remove('show');
        });
    });
}

function initSidebarToggle() {
    document.getElementById('sidebarToggle')?.addEventListener('click', () => {
        document.querySelector('.dashboard-sidebar')?.classList.toggle('open');
        document.getElementById('sidebarOverlay')?.classList.toggle('show');
    });
    document.getElementById('sidebarOverlay')?.addEventListener('click', () => {
        document.querySelector('.dashboard-sidebar')?.classList.remove('open');
        document.getElementById('sidebarOverlay')?.classList.remove('show');
    });
}
