import React, { useState, useEffect } from 'react';

const HomeIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const PlusIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>;
const EditIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.85 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>;
const Trash2Icon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>;
const ArrowUpIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>;
const ArrowDownIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>;
const ChevronLeftIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>;
const ChevronRightIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>;


// Functions
const TASKS_STORAGE_KEY = 'task_management_app_tasks';
const STATUS_OPTIONS = ["Pending", "In Progress", "Complete"];
const PRIORITY_OPTIONS = ["Low", "Medium", "High"];

// Helper function to get color classes based on priority
const getPriorityColor = (priority) => {
    switch (priority) {
        case 'High':
            return 'bg-red-500/10 text-red-600 border border-red-300';
        case 'Medium':
            // Removed the duplicate 'case "Medium"' that caused the error.
            return 'bg-yellow-500/10 text-yellow-600 border border-yellow-300';
        case 'Low':
            return 'bg-green-500/10 text-green-600 border border-green-300';
        default:
            return 'bg-gray-500/10 text-gray-600 border border-gray-300';
    }
};

// Helper function to get color classes based on status
const getStatusColor = (status) => {
    if (status === 'Complete') {
        return 'bg-emerald-500/10 text-emerald-600';
    } else if (status === 'In Progress') {
        return 'bg-blue-500/10 text-blue-600';
    } else {
        return 'bg-gray-500/10 text-gray-600';
    }
};

// Helper function to format the date string
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    // Simple date format without complex options
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
};



const useTaskForm = (initialState) => {
    const [values, setValues] = useState(initialState);
    const [errors, setErrors] = useState({});

    // Simple handler for all form fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    // Simple validation function
    const validate = (data) => {
        const newErrors = {};
        if (!data.title || data.title.length < 3) newErrors.title = "Title must be at least 3 letters long.";
        if (!data.description || data.description.length < 10) newErrors.description = "Description must be at least 10 letters long.";
        if (!data.dueDate) newErrors.dueDate = "Please pick a Due Date.";
        
        return newErrors;
    };

    const resetForm = () => {
        setValues(initialState);
        setErrors({});
    };

    const handleValidation = () => {
        const newErrors = validate(values);
        setErrors(newErrors);
        // Returns true if there are no errors
        return Object.keys(newErrors).length === 0;
    };

    return {
        values,
        errors,
        handleChange,
        handleValidation,
        setValues,
        resetForm
    };
};



const Modal = ({ title, message, onConfirm, onCancel, show }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">{title}</h3>
                <p className="text-gray-600 mb-6">{message}</p>
                <div className="flex justify-end space-x-3">
                    {onCancel && (
                        <button
                            onClick={onCancel}
                            className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 shadow-md shadow-red-300"
                    >
                        {onCancel ? 'Delete It' : 'Got It'}
                    </button>
                </div>
            </div>
        </div>
    );
};



const TaskForm = ({ taskToEdit, onSave, onCancel }) => {
    const defaultState = taskToEdit || {
        id: null,
        title: '',
        description: '',
        status: STATUS_OPTIONS[0],
        priority: PRIORITY_OPTIONS[1],
        dueDate: new Date().toISOString().substring(0, 10),
    };

    const { values, errors, handleChange, handleValidation, resetForm } = useTaskForm(defaultState);
    const isEditing = !!taskToEdit;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (handleValidation()) {
            // Save the task and then reset the form
            onSave(values);
            resetForm();
        }
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100 max-w-2xl mx-auto">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
                {isEditing ? 'Change Task Details' : 'Add a Brand New Task'}
            </h1>
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Title Input */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={values.title}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="What's the goal?"
                    />
                    {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
                </div>

                {/* Description Textarea */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={values.description}
                        onChange={handleChange}
                        rows="4"
                        className={`w-full px-4 py-2 border rounded-lg ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Explain what needs to be done..."
                    ></textarea>
                    {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
                </div>

                {/* Status, Priority, Due Date (Grid Layout) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Status Select */}
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            id="status"
                            name="status"
                            value={values.status}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg appearance-none bg-white border-gray-300"
                        >
                            {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    </div>

                    {/* Priority Select */}
                    <div>
                        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                        <select
                            id="priority"
                            name="priority"
                            value={values.priority}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg appearance-none bg-white border-gray-300"
                        >
                            {PRIORITY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    </div>

                    {/* Due Date Input */}
                    <div>
                        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                        <input
                            type="date"
                            id="dueDate"
                            name="dueDate"
                            value={values.dueDate}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border rounded-lg ${errors.dueDate ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.dueDate && <p className="mt-1 text-xs text-red-500">{errors.dueDate}</p>}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg shadow-sm hover:bg-gray-50"
                    >
                        Never Mind
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md shadow-blue-300 hover:bg-blue-700 flex items-center"
                    >
                        {isEditing ? 'Save Changes' : 'Add Task'}
                    </button>
                </div>
            </form>
        </div>
    );
};



const TaskTable = ({ tasks, onEdit, onDelete }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('dueDate');
    const [sortDirection, setSortDirection] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const tasksPerPage = 5;

    // State for modal confirmation
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);

    
    const lowerCaseSearch = searchTerm.toLowerCase();
    const filteredTasks = tasks.filter(task =>
        task.title.toLowerCase().includes(lowerCaseSearch) ||
        task.description.toLowerCase().includes(lowerCaseSearch) ||
        task.status.toLowerCase().includes(lowerCaseSearch) ||
        task.priority.toLowerCase().includes(lowerCaseSearch)
    );

    // --- Simple Sorting Logic ---
    const sortedTasks = [...filteredTasks].sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];

        let comparison = 0;
        if (aValue > bValue) comparison = 1;
        else if (aValue < bValue) comparison = -1;

        return sortDirection === 'asc' ? comparison : comparison * -1;
    });

    // --- Pagination Logic ---
    const totalPages = Math.ceil(sortedTasks.length / tasksPerPage);
    const startIndex = (currentPage - 1) * tasksPerPage;
    const paginatedTasks = sortedTasks.slice(startIndex, startIndex + tasksPerPage);

    // Handlers
    const handleSort = (key) => {
        if (sortBy === key) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(key);
            setSortDirection('asc');
        }
    };

    const handlePageChange = (page) => {
        // Simple bounds check
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const confirmDelete = (task) => {
        setTaskToDelete(task);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirmed = () => {
        // Execute the delete action from the parent
        onDelete(taskToDelete.id);
        setShowDeleteModal(false);
        setTaskToDelete(null);
    };

    const getSortIcon = (key) => {
        if (sortBy !== key) return null;
        return sortDirection === 'asc' ? <ArrowUpIcon className="w-4 h-4 ml-1" /> : <ArrowDownIcon className="w-4 h-4 ml-1" />;
    };

    const tableHeaders = [
        { key: 'title', label: 'Task Name' },
        { key: 'dueDate', label: 'Due Date' },
        { key: 'priority', label: 'Priority' },
        { key: 'status', label: 'Status' },
        { key: 'actions', label: 'Actions', sortable: false },
    ];

    return (
        <div className="p-4 md:p-8 bg-white rounded-xl shadow-lg border border-gray-100">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Your Task List ({tasks.length})</h1>

            {/* Search Input */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Type here to search tasks..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1); // Reset page on search
                    }}
                    className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm"
                />
            </div>

            {/* Task Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {tableHeaders.map(header => (
                                <th
                                    key={header.key}
                                    className={`px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase ${header.sortable !== false ? 'cursor-pointer hover:bg-gray-100' : ''} ${header.key === 'actions' ? 'text-right' : ''}`}
                                    onClick={() => header.sortable !== false && handleSort(header.key)}
                                >
                                    <div className="flex items-center">
                                        {header.label}
                                        {getSortIcon(header.key)}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {paginatedTasks.length > 0 ? (
                            paginatedTasks.map((task) => (
                                <tr key={task.id} className="hover:bg-blue-50/50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-xs truncate">{task.title}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{formatDate(task.dueDate)}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`px-3 py-1 inline-flex text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                                            {task.priority}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`px-3 py-1 inline-flex text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                                            {task.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                                        <button
                                            onClick={() => onEdit(task.id)}
                                            className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-100 mr-2"
                                            title="Edit Task"
                                        >
                                            <EditIcon className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => confirmDelete(task)}
                                            className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100"
                                            title="Delete Task"
                                        >
                                            <Trash2Icon className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center py-10 text-gray-500 text-lg">
                                    {searchTerm ? "Couldn't find any tasks matching your search." : "No tasks added yet!"}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-between items-center mt-6">
                    <p className="text-sm text-gray-600">
                        Page {currentPage} of {totalPages}
                    </p>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="p-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                            <ChevronLeftIcon className="w-4 h-4" />
                        </button>

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="p-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                            <ChevronRightIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <Modal
                title="Are you sure?"
                message={`This will delete the task: "${taskToDelete?.title}". You cannot undo this!`}
                onConfirm={handleDeleteConfirmed}
                onCancel={() => setShowDeleteModal(false)}
                show={showDeleteModal}
            />
        </div>
    );
};


export default function App() {
    const [tasks, setTasks] = useState([]);
    const [page, setPage] = useState('home'); // Controls which page is showing
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [modalConfig, setModalConfig] = useState({ show: false, title: '', message: '', onConfirm: null });

    // --- Load data when the app starts ---
    useEffect(() => {
        try {
            const storedTasks = JSON.parse(localStorage.getItem(TASKS_STORAGE_KEY));
            if (storedTasks && Array.isArray(storedTasks)) {
                setTasks(storedTasks);
            } else {
                setTasks(INITIAL_TASKS); // Use mock data if nothing is saved
            }
        } catch (error) {
            console.error("Failed to load tasks:", error);
            setTasks(INITIAL_TASKS);
        }
    }, []);

    // --- Save data whenever the tasks change (simple beginner save) ---
    useEffect(() => {
        try {
            localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
        } catch (error) {
            console.error("Failed to save tasks:", error);
        }
    }, [tasks]);

    // --- Navigation Handlers ---
    const goToHome = () => {
        setPage('home');
        setEditingTaskId(null);
    };

    const goToCreate = () => {
        setPage('create');
        setEditingTaskId(null);
    };

    const goToEdit = (id) => {
        setEditingTaskId(id);
        setPage('edit');
    };

    // --- CRUD Operations ---
    const addTask = (newTask) => {
        // Simple way to generate a new ID
        const newId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
        const taskWithId = { ...newTask, id: newId };
        setTasks(prevTasks => [...prevTasks, taskWithId]);

        // Show a quick success message
        setModalConfig({
            show: true,
            title: "Success!",
            message: `Task "${newTask.title}" was added!`,
            onConfirm: () => { setModalConfig({ show: false }); goToHome(); },
        });
    };

    const updateTask = (updatedTask) => {
        setTasks(prevTasks => prevTasks.map(t =>
            t.id === updatedTask.id ? updatedTask : t
        ));

        // Show a quick success message
        setModalConfig({
            show: true,
            title: "Task Updated!",
            message: `Task "${updatedTask.title}" changes saved.`,
            onConfirm: () => { setModalConfig({ show: false }); goToHome(); },
        });
    };

    const deleteTask = (id) => {
        setTasks(prevTasks => prevTasks.filter(t => t.id !== id));
    };

    // Find the task that needs to be edited
    const taskToEdit = tasks.find(t => t.id === editingTaskId);

    // --- Renders the correct component based on the 'page' state ---
    const renderContent = () => {
        if (page === 'create') {
            return <TaskForm onSave={addTask} onCancel={goToHome} />;
        } else if (page === 'edit') {
            if (!taskToEdit) return <p className="text-center p-10">Error: Task not found!</p>;
            return <TaskForm taskToEdit={taskToEdit} onSave={updateTask} onCancel={goToHome} />;
        } else {
            // Default to 'home'
            return (
                <TaskTable
                    tasks={tasks}
                    onEdit={goToEdit}
                    onDelete={deleteTask}
                />
            );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans p-4 md:p-8">
            <header className="flex justify-between items-center mb-8 p-4 bg-white rounded-xl shadow-md sticky top-4 z-10">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                    <HomeIcon className="w-6 h-6 mr-2 text-blue-600" />Task Management
                </h1>
                <div className="space-x-4 flex">
                    <button
                        onClick={goToHome}
                        className={`px-4 py-2 rounded-lg font-semibold flex items-center shadow-sm ${page === 'home' ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
                    >
                        <HomeIcon className="w-5 h-5 mr-2" />
                        Home
                    </button>
                    <button
                        onClick={goToCreate}
                        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md shadow-blue-300 hover:bg-blue-700 flex items-center"
                    >
                        <PlusIcon className="w-5 h-5 mr-2" />
                        New Task
                    </button>
                </div>
            </header>

            <main className="max-w-6xl mx-auto">
                {renderContent()}
            </main>

            {/*Success/Error Messages */}
            <Modal
                title={modalConfig.title}
                message={modalConfig.message}
                onConfirm={modalConfig.onConfirm}
            
                show={modalConfig.show}
            />
        </div>
    );
}
