const AWS_STORE_KEY = 'aws_agni_dashboard_v1';

const AWS_DEFAULT_STORE = {
    clients: [
        { id: 'AWS-FF001', phone: '9080700642', name: 'VinothKumar', company: 'Femme Flex Ladies Gym', email: 'client@femmeflex.com' },
        { id: 'AWS-IE001', phone: '9080700642', name: 'Sankar', company: 'Iron Empire Fitness Gym', email: 'sankar@ironempire.in' },
        { id: 'AWS-DEMO', phone: '9080700642', name: 'Demo Client', company: 'Your Business', email: 'demo@example.com' }
    ],
    projects: [
        {
            id: 'proj-1',
            clientId: 'AWS-FF001',
            name: 'Femme Flex Website',
            type: 'Website Development',
            status: 'completed',
            progress: 100,
            startDate: '2025-11-01',
            dueDate: '2025-11-20',
            url: 'https://www.femmeflexladiesgym.com',
            timeline: [
                { step: 'Requirements', done: true, date: '2025-11-02' },
                { step: 'Design', done: true, date: '2025-11-08' },
                { step: 'Development', done: true, date: '2025-11-15' },
                { step: 'Testing & Launch', done: true, date: '2025-11-18' }
            ]
        },
        {
            id: 'proj-2',
            clientId: 'AWS-IE001',
            name: 'Iron Empire Gym App',
            type: 'Software Development',
            status: 'in-progress',
            progress: 75,
            startDate: '2026-01-10',
            dueDate: '2026-03-15',
            url: 'https://ironempirefitness.in',
            timeline: [
                { step: 'Requirements', done: true, date: '2026-01-12' },
                { step: 'Design', done: true, date: '2026-01-25' },
                { step: 'Development', done: false, date: 'In Progress' },
                { step: 'Testing & Launch', done: false, date: 'Pending' }
            ]
        },
        {
            id: 'proj-demo',
            clientId: 'AWS-DEMO',
            name: 'Business Website',
            type: 'Website Development',
            status: 'in-progress',
            progress: 45,
            startDate: '2026-06-01',
            dueDate: '2026-07-01',
            url: '',
            timeline: [
                { step: 'Requirements', done: true, date: '2026-06-02' },
                { step: 'Design', done: true, date: '2026-06-10' },
                { step: 'Development', done: false, date: 'In Progress' },
                { step: 'Testing & Launch', done: false, date: 'Pending' }
            ]
        }
    ],
    invoices: [
        { id: 'INV-001', clientId: 'AWS-FF001', projectId: 'proj-1', amount: 15000, status: 'paid', date: '2025-11-01', desc: 'Website Development — 50% Advance' },
        { id: 'INV-002', clientId: 'AWS-FF001', projectId: 'proj-1', amount: 15000, status: 'paid', date: '2025-11-18', desc: 'Website Development — Final Payment' },
        { id: 'INV-003', clientId: 'AWS-IE001', projectId: 'proj-2', amount: 25000, status: 'paid', date: '2026-01-10', desc: 'Software Project — Advance' },
        { id: 'INV-004', clientId: 'AWS-IE001', projectId: 'proj-2', amount: 25000, status: 'pending', date: '2026-03-15', desc: 'Software Project — Final Payment' }
    ],
    tickets: [
        { id: 'TKT-001', clientId: 'AWS-FF001', subject: 'Update gym timings on website', status: 'resolved', date: '2025-12-05', message: 'Please update morning batch timing to 6 AM.', reply: 'Updated and live. Thank you!' },
        { id: 'TKT-002', clientId: 'AWS-IE001', subject: 'Add new membership plan', status: 'open', date: '2026-06-15', message: 'Need to add annual membership pricing section.', reply: '' }
    ],
    leads: [],
    posTrials: [],
    testimonials: [],
    newsletter: []
};

const AWSAdminAuth = {
    username: 'admin',
    password: 'awsagni2026'
};

function awsGetStore() {
    try {
        const raw = localStorage.getItem(AWS_STORE_KEY);
        if (!raw) {
            localStorage.setItem(AWS_STORE_KEY, JSON.stringify(AWS_DEFAULT_STORE));
            return JSON.parse(JSON.stringify(AWS_DEFAULT_STORE));
        }
        const data = JSON.parse(raw);
        if (!data.newsletter) data.newsletter = [];
        if (!data.leads) data.leads = [];
        if (!data.posTrials) data.posTrials = [];
        return data;
    } catch {
        return JSON.parse(JSON.stringify(AWS_DEFAULT_STORE));
    }
}

function awsSaveStore(data) {
    localStorage.setItem(AWS_STORE_KEY, JSON.stringify(data));
}

function awsAddLead(entry) {
    const store = awsGetStore();
    store.leads.unshift({
        id: 'LD-' + Date.now(),
        date: new Date().toISOString().slice(0, 10),
        status: 'new',
        ...entry
    });
    awsSaveStore(store);
}

function awsAddNewsletter(email) {
    const store = awsGetStore();
    if (store.newsletter.some(n => n.email === email)) return false;
    store.newsletter.unshift({
        id: 'NL-' + Date.now(),
        email,
        date: new Date().toISOString().slice(0, 10),
        status: 'subscribed'
    });
    awsSaveStore(store);
    return true;
}

function awsAddPosTrial(entry) {
    const store = awsGetStore();
    store.posTrials.unshift({
        id: 'POS-' + Date.now(),
        date: new Date().toISOString().slice(0, 10),
        status: 'new',
        ...entry
    });
    awsSaveStore(store);
}

function awsAddTicket(clientId, subject, message) {
    const store = awsGetStore();
    store.tickets.unshift({
        id: 'TKT-' + Date.now(),
        clientId,
        subject,
        message,
        reply: '',
        status: 'open',
        date: new Date().toISOString().slice(0, 10)
    });
    awsSaveStore(store);
}

function awsFindClient(clientId, phone) {
    const store = awsGetStore();
    const cleanPhone = (phone || '').replace(/\D/g, '').slice(-10);
    return store.clients.find(c =>
        c.id.toUpperCase() === (clientId || '').toUpperCase() &&
        c.phone.slice(-10) === cleanPhone
    );
}

function awsGetClientData(clientId) {
    const store = awsGetStore();
    return {
        projects: store.projects.filter(p => p.clientId === clientId),
        invoices: store.invoices.filter(i => i.clientId === clientId),
        tickets: store.tickets.filter(t => t.clientId === clientId)
    };
}

function awsStatusLabel(status) {
    const map = {
        'new': 'New', 'open': 'Open', 'in-progress': 'In Progress',
        'completed': 'Completed', 'paid': 'Paid', 'pending': 'Pending',
        'resolved': 'Resolved', 'contacted': 'Contacted'
    };
    return map[status] || status;
}

function awsStatusClass(status) {
    const map = {
        'new': 'badge-new', 'open': 'badge-open', 'in-progress': 'badge-progress',
        'completed': 'badge-done', 'paid': 'badge-done', 'pending': 'badge-pending',
        'resolved': 'badge-done', 'contacted': 'badge-progress'
    };
    return map[status] || 'badge-new';
}
