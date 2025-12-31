import React, { useEffect, useState } from 'react';
import { Plus, X, Upload, Image as ImageIcon, Save, ArrowLeft, Heart, Eye, MessageCircle, Share2, Loader2, Edit, Trash2, Filter } from 'lucide-react';

const API_BASE_URL = ' https://backend-09w4.onrender.com/api';

export default function BehanceDashboard() {
  const [showDialog, setShowDialog] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'graphic-design',
    coverImage: null,
    coverImagePreview: null,
    images: [],
    imagePreviews: []
  });

  useEffect(() => {
    fetchCategories();
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchProjects(selectedCategory);
    } else {
      fetchProjects();
    }
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchProjects = async (category = '') => {
    try {
      const url = category 
        ? `${API_BASE_URL}/projects?category=${category}`
        : `${API_BASE_URL}/projects`;
      const response = await fetch(url);
      const data = await response.json();
      setProjects(data.projects || []);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  };

  const fetchProjectById = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${id}`);
      const data = await response.json();
      setSelectedProject(data);
    } catch (error) {
      console.error('Failed to fetch project:', error);
    }
  };

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          const maxWidth = 1920;
          const maxHeight = 1920;

          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            } else {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              resolve(new File([blob], file.name, { type: 'image/jpeg' }));
            },
            'image/jpeg',
            0.85
          );
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleCoverImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadProgress(10);
    const compressedFile = await compressImage(file);
    
    setFormData(prev => ({
      ...prev,
      coverImage: compressedFile,
      coverImagePreview: URL.createObjectURL(compressedFile)
    }));

    setUploadProgress(0);
  };

  const handleImagesChange = async (e) => {
    const files = Array.from(e.target.files);
    setUploadProgress(10);
    
    const compressionPromises = files.map(file => compressImage(file));
    const compressedFiles = await Promise.all(compressionPromises);
    
    const previews = compressedFiles.map(file => URL.createObjectURL(file));
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...compressedFiles],
      imagePreviews: [...prev.imagePreviews, ...previews]
    }));

    setUploadProgress(0);
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    const newPreviews = formData.imagePreviews.filter((_, i) => i !== index);
    
    URL.revokeObjectURL(formData.imagePreviews[index]);
    
    setFormData({ 
      ...formData, 
      images: newImages,
      imagePreviews: newPreviews
    });
  };

  const handleSave = async () => {
    try {
      if (!formData.title) {
        alert("Title is required");
        return;
      }

      if (!editMode && !formData.coverImage) {
        alert("Cover image is required for new projects");
        return;
      }

      setIsUploading(true);
      setUploadProgress(20);

      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("category", formData.category);

      setUploadProgress(30);

      if (formData.coverImage) {
        formDataToSend.append("coverImage", formData.coverImage);
      }

      setUploadProgress(50);

      formData.images.forEach((file) => {
        formDataToSend.append("images", file);
      });

      setUploadProgress(70);

      const url = editMode 
        ? `${API_BASE_URL}/projects/${editingProjectId}`
        : `${API_BASE_URL}/projects`;
      
      const method = editMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });

      setUploadProgress(90);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Operation failed");
      }

      const data = await response.json();
      setUploadProgress(100);

      await fetchProjects(selectedCategory);
      
      setFormData({
        title: '',
        description: '',
        category: 'graphic-design',
        coverImage: null,
        coverImagePreview: null,
        images: [],
        imagePreviews: []
      });

      setShowDialog(false);
      setIsUploading(false);
      setUploadProgress(0);
      setEditMode(false);
      setEditingProjectId(null);

      alert(editMode 
        ? 'Project updated successfully!' 
        : `Project created successfully! Upload time: ${data.uploadTime}`
      );

    } catch (error) {
      console.error("Operation error:", error.message);
      alert(error.message);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleEdit = (project) => {
    setEditMode(true);
    setEditingProjectId(project.id);
    setFormData({
      title: project.title,
      description: project.description || '',
      category: project.category,
      coverImage: null,
      coverImagePreview: project.coverImageUrl,
      images: [],
      imagePreviews: project.imagesUrls || []
    });
    setShowDialog(true);
  };

  const handleDelete = async (projectId) => {
    if (!confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Delete failed');
      }

      alert('Project deleted successfully!');
      await fetchProjects(selectedCategory);
      
      if (selectedProject && selectedProject.id === projectId) {
        setSelectedProject(null);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert(error.message);
    }
  };

  const handleProjectClick = (project) => {
    fetchProjectById(project.id);
  };

  const handleBackToProjects = () => {
    setSelectedProject(null);
  };

  const openCreateDialog = () => {
    setEditMode(false);
    setEditingProjectId(null);
    setFormData({
      title: '',
      description: '',
      category: 'graphic-design',
      coverImage: null,
      coverImagePreview: null,
      images: [],
      imagePreviews: []
    });
    setShowDialog(true);
  };

  // Project Detail View
  if (selectedProject) {
    return (
      <div className="min-h-screen bg-white">
        <header className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold">Behance</h1>
            <nav className="flex gap-6 text-sm">
              <a href="#" className="hover:text-gray-300">Explore</a>
              <a href="#" className="hover:text-gray-300">Jobs</a>
              <a href="#" className="hover:text-gray-300">Client Work</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm font-medium">
              Start Free Trial
            </button>
          </div>
        </header>

        <div className="max-w-5xl mx-auto px-6 py-6">
          <button
            onClick={handleBackToProjects}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Projects
          </button>

          <div className="flex items-start justify-between mb-8">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{selectedProject.title}</h1>
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>{selectedProject.views || 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  <span>{selectedProject.likes || 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  <span>{selectedProject.comments || 0}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleEdit(selectedProject)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(selectedProject.id)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-200">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-lg font-bold text-white">
              YP
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Yash Prajapati</h3>
              <p className="text-sm text-gray-500">Graphic Designer, Logo and Brand Identity Designer</p>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium">
              Follow
            </button>
          </div>

          {selectedProject.description && (
            <div className="mb-8">
              <p className="text-gray-700 leading-relaxed">{selectedProject.description}</p>
            </div>
          )}

          <div className="mb-8">
            <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-4 py-2 rounded-full">
              {categories.find(c => c.value === selectedProject.category)?.label}
            </span>
          </div>

          <div className="mb-8">
            <img
              src={selectedProject.coverImageUrl}
              alt={selectedProject.title}
              className="w-full rounded-lg shadow-lg"
            />
          </div>

          {selectedProject.imagesUrls && selectedProject.imagesUrls.length > 0 && (
            <div className="space-y-8 mb-12">
              {selectedProject.imagesUrls.map((img, index) => (
                <div key={index}>
                  <img
                    src={img}
                    alt={`${selectedProject.title} - Image ${index + 1}`}
                    className="w-full rounded-lg shadow-lg"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-center gap-4 py-8 border-t border-b border-gray-200 mb-12">
            <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">
              <Heart className="w-5 h-5" />
              Like
            </button>
            <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium">
              <Share2 className="w-5 h-5" />
              Share
            </button>
          </div>

          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">More from Yash Prajapati</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {projects.filter(p => p.id !== selectedProject.id).slice(0, 3).map((project) => (
                <div
                  key={project.id}
                  onClick={() => handleProjectClick(project)}
                  className="group cursor-pointer"
                >
                  <div className="relative overflow-hidden rounded-lg mb-3 bg-gray-100" style={{ paddingBottom: '75%' }}>
                    <img
                      src={project.coverImageUrl}
                      alt={project.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all" />
                  </div>
                  <h4 className="font-semibold text-gray-900">{project.title}</h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Dashboard View
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-bold">Behance</h1>
          <nav className="flex gap-6 text-sm">
            <a href="#" className="hover:text-gray-300">Explore</a>
            <a href="#" className="hover:text-gray-300">Jobs</a>
            <a href="#" className="hover:text-gray-300">Client Work</a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm font-medium">
            Start Free Trial
          </button>
          <button className="border border-white hover:bg-gray-800 px-4 py-2 rounded text-sm font-medium">
            Share Work
          </button>
        </div>
      </header>

      <div className="bg-gray-800 text-white px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start gap-6">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-4xl font-bold">
              YP
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-2">Yash Prajapati</h2>
              <p className="text-gray-300 mb-1">Graphic Designer, Logo and Brand Identity Designer</p>
              <p className="text-gray-400 text-sm">arrowdzign • Surat, India</p>
              <div className="mt-4">
                <span className="inline-block bg-green-600 text-xs px-3 py-1 rounded-full">Available Now</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h3 className="text-2xl font-bold text-gray-900">Projects</h3>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button 
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
            onClick={openCreateDialog}
          >
            <Plus className="w-5 h-5" />
            Create Project
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No projects found. Create your first project!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="group">
                <div
                  onClick={() => handleProjectClick(project)}
                  className="cursor-pointer"
                >
                  <div className="relative overflow-hidden rounded-lg mb-3 bg-gray-100" style={{ paddingBottom: '75%' }}>
                    <img
                      src={project.coverImageUrl}
                      alt={project.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center gap-4 text-white text-sm">
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          <span>{project.likes || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{project.views || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">{project.title}</h4>
                  <p className="text-sm text-gray-500 mb-1 line-clamp-2">{project.description}</p>
                  <p className="text-xs text-blue-600 font-medium">
                    {categories.find(c => c.value === project.category)?.label}
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => handleEdit(project)}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-50 hover:bg-blue-100 text-blue-600 rounded font-medium"
                  >
                    <Edit className="w-3 h-3" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-red-50 hover:bg-red-100 text-red-600 rounded font-medium"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">
                {editMode ? 'Edit Project' : 'Create New Project'}
              </h3>
              <button
                onClick={() => {
                  if (!isUploading) {
                    setShowDialog(false);
                    setEditMode(false);
                    setEditingProjectId(null);
                  }
                }}
                className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                disabled={isUploading}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {isUploading && (
              <div className="px-6 py-4 bg-blue-50 border-b border-blue-200">
                <div className="flex items-center gap-3 mb-2">
                  <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                  <span className="text-sm font-medium text-blue-900">
                    {editMode ? 'Updating' : 'Uploading'} project... {uploadProgress}%
                  </span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Project Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter project title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isUploading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your project"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  disabled={isUploading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isUploading}
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Cover Image {!editMode && '*'} {editMode && '(Leave empty to keep current)'}
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {formData.coverImagePreview ? (
                    <div className="relative">
                      <img
                        src={formData.coverImagePreview}
                        alt="Cover"
                        className="w-full h-48 object-cover rounded"
                      />
                      {!isUploading && (
                        <button
                          onClick={() => setFormData({ 
                            ...formData, 
                            coverImage: null,
                            coverImagePreview: null
                          })}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ) : (
                    <label className={`cursor-pointer ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-1">Click to upload cover image</p>
                      <p className="text-xs text-gray-400">Images will be automatically compressed</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverImageChange}
                        className="hidden"
                        disabled={isUploading}
                      />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Project Images {editMode && '(Leave empty to keep current)'}
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4">
                  <label className={`cursor-pointer ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-1">Click to upload multiple images</p>
                    <p className="text-xs text-gray-400">Images will be compressed for faster upload</p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImagesChange}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                </div>

                {formData.imagePreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-4">
                    {formData.imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Project ${index + 1}`}
                          className="w-full h-32 object-cover rounded"
                        />
                        {!isUploading && formData.images.length > 0 && (
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowDialog(false);
                  setEditMode(false);
                  setEditingProjectId(null);
                }}
                className="px-6 py-2 text-gray-700 hover:bg-gray-200 rounded-lg font-medium disabled:opacity-50"
                disabled={isUploading}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!formData.title || (!editMode && !formData.coverImage) || isUploading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {editMode ? 'Updating...' : 'Uploading...'}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {editMode ? 'Update Project' : 'Save Project'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}