document.addEventListener('DOMContentLoaded', function() {
    const SESSION_KEY = 'aws_client_session';
    const loginView = document.getElementById('portalLogin');
    const dashView = document.getElementById('portalDashboard');

    if (sessionStorage.getItem(SESSION_KEY)) {
        showDashboard(JSON.parse(sessionStorage.getItem(SESSION_KEY)));
    }

    document.getElementById('portalLoginForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        const clientId = document.getElementById('clientId').value.trim();
        const phone = document.getElementById('clientPhone').value.trim();
        const err = document.getElementById('loginError');

        const client = awsFindClient(clientId, phone);
        if (!client) {
            err.textContent = 'Invalid Client ID or Phone Number.';
            err.classList.add('show');
            return;
        }

        err.classList.remove('show');
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(client));
        showDashboard(client);
    });

    document.getElementById('portalLogout')?.addEventListener('click', function(e) {
        e.preventDefault();
        sessionStorage.removeItem(SESSION_KEY);
        loginView.style.display = 'flex';
        dashView.style.display = 'none';
    });

    document.getElementById('ticketForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        const client = JSON.parse(sessionStorage.getItem(SESSION_KEY));
        const subject = document.getElementById('ticketSubject').value.trim();
        const message = document.getElementById('ticketMessage').value.trim();
        if (!subject || !message) return;

        awsAddTicket(client.id, subject, message);
        document.getElementById('ticketForm').reset();
        renderTickets(client.id);
        alert('Support ticket submitted! We will reply soon.');
    });

    initPortalNav();
    initSidebarToggle();
});

function showDashboard(client) {
    document.getElementById('portalLogin').style.display = 'none';
    document.getElementById('portalDashboard').style.display = 'block';

    document.getElementById('clientName').textContent = client.name;
    document.getElementById('clientCompany').textContent = client.company;
    document.getElementById('welcomeName').textContent = client.name.split(' ')[0];

    const data = awsGetClientData(client.id);
    renderOverview(data);
    renderProjects(data.projects);
    renderInvoices(data.invoices);
    renderTickets(client.id);
}

function renderOverview(data) {
    const active = data.projects.filter(p => p.status !== 'completed').length;
    const pending = data.invoices.filter(i => i.status === 'pending').length;
    const openTickets = data.tickets.filter(t => t.status === 'open').length;

    document.getElementById('statProjects').textContent = data.projects.length;
    document.getElementById('statActive').textContent = active;
    document.getElementById('statInvoices').textContent = pending;
    document.getElementById('statTickets').textContent = openTickets;
}

function renderProjects(projects) {
    const el = document.getElementById('projectsList');
    if (!projects.length) {
        el.innerHTML = '<div class="empty-state"><i class="fas fa-folder-open"></i>No projects yet.</div>';
        return;
    }

    el.innerHTML = projects.map(p => `
        <div class="dash-panel">
            <div class="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-2">
                <div>
                    <strong>${p.name}</strong>
                    <div class="text-muted small">${p.type}</div>
                </div>
                <span class="status-badge ${awsStatusClass(p.status)}">${awsStatusLabel(p.status)}</span>
            </div>
            <div class="small text-muted mb-1">Progress: ${p.progress}%</div>
            <div class="progress-bar-wrap"><div class="progress-bar-fill" style="width:${p.progress}%"></div></div>
            <div class="small text-muted mt-2">Due: ${p.dueDate}${p.url ? ` · <a href="${p.url}" target="_blank" rel="noopener">Visit Site</a>` : ''}</div>
            <ul class="timeline-list mt-3">
                ${p.timeline.map(t => `
                    <li>
                        <span class="tl-dot ${t.done ? 'done' : 'pending'}"><i class="fas fa-${t.done ? 'check' : 'clock'}"></i></span>
                        <div><strong>${t.step}</strong><div class="small text-muted">${t.date}</div></div>
                    </li>
                `).join('')}
            </ul>
        </div>
    `).join('');
}

function renderInvoices(invoices) {
    const el = document.getElementById('invoicesTable');
    if (!invoices.length) {
        el.innerHTML = '<tr><td colspan="4" class="text-center text-muted">No invoices.</td></tr>';
        return;
    }
    el.innerHTML = invoices.map(i => `
        <tr>
            <td>${i.id}</td>
            <td>${i.desc}</td>
            <td>₹${i.amount.toLocaleString('en-IN')}</td>
            <td><span class="status-badge ${awsStatusClass(i.status)}">${awsStatusLabel(i.status)}</span></td>
        </tr>
    `).join('');
}

function renderTickets(clientId) {
    const data = awsGetClientData(clientId);
    const el = document.getElementById('ticketsList');
    if (!data.tickets.length) {
        el.innerHTML = '<div class="empty-state"><i class="fas fa-headset"></i>No support tickets yet.</div>';
        return;
    }
    el.innerHTML = data.tickets.map(t => `
        <div class="dash-panel">
            <div class="d-flex justify-content-between align-items-start gap-2 mb-2">
                <strong>${t.subject}</strong>
                <span class="status-badge ${awsStatusClass(t.status)}">${awsStatusLabel(t.status)}</span>
            </div>
            <p class="small mb-2">${t.message}</p>
            ${t.reply ? `<div class="small p-2 rounded" style="background:rgba(0,200,83,0.08);color:#00c853;"><strong>Reply:</strong> ${t.reply}</div>` : '<div class="small text-muted">Awaiting reply...</div>'}
            <div class="small text-muted mt-2">${t.date}</div>
        </div>
    `).join('');
}

function initPortalNav() {
    document.querySelectorAll('[data-portal-tab]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const tab = this.dataset.portalTab;
            document.querySelectorAll('[data-portal-tab]').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            document.querySelectorAll('.dash-tab-content').forEach(t => t.classList.remove('active'));
            document.getElementById('tab-' + tab)?.classList.add('active');
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
