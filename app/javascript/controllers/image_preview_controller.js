import { Controller } from "@hotwired/stimulus"

// Global function for removing existing images
window.removeExistingImage = function(imageId, buttonElement) {
  console.log('Global removeExistingImage called with ID:', imageId)
  
  const imageContainer = buttonElement.closest('.relative.group')
  console.log('Image container:', imageContainer)
  
  if (confirm('Are you sure you want to remove this image?')) {
    // Create a hidden input to track removed images
    let removedImagesInput = document.getElementById('removed_image_ids')
    if (!removedImagesInput) {
      removedImagesInput = document.createElement('input')
      removedImagesInput.type = 'hidden'
      removedImagesInput.name = 'removed_image_ids[]'
      removedImagesInput.id = 'removed_image_ids'
      document.querySelector('form').appendChild(removedImagesInput)
    }
    
    // Add the image ID to the removed images list
    const removedIds = removedImagesInput.value ? removedImagesInput.value.split(',') : []
    if (!removedIds.includes(imageId)) {
      removedIds.push(imageId)
      removedImagesInput.value = removedIds.join(',')
    }
    
    // Remove the image container from the UI
    imageContainer.remove()
    
    // Show success message
    showImageSuccess('Image will be removed when you save the post.')
    
    // Debug: log the removed IDs
    console.log('Removed image IDs:', removedImagesInput.value)
  }
}

// Global function for showing success messages
window.showImageSuccess = function(message) {
  // Create or update success message
  let successDiv = document.getElementById('image-success-message')
  if (!successDiv) {
    successDiv = document.createElement('div')
    successDiv.id = 'image-success-message'
    successDiv.className = 'mt-2 p-3 bg-green-50 border border-green-200 rounded-lg'
    
    const container = document.getElementById('image-preview-container')
    if (container) {
      container.parentNode.insertBefore(successDiv, container)
    } else {
      document.querySelector('form').appendChild(successDiv)
    }
  }
  
  successDiv.innerHTML = `
    <div class="flex items-center">
      <svg class="w-4 h-4 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
      </svg>
      <span class="text-sm text-green-700">${message}</span>
    </div>
  `
  
  // Auto-hide success after 3 seconds
  setTimeout(() => {
    if (successDiv) {
      successDiv.remove()
    }
  }, 3000)
}

export default class extends Controller {
  static targets = ["container", "grid"]

  preview(event) {
    const files = event.target.files
    const container = document.getElementById('image-preview-container')
    const grid = document.getElementById('image-preview-grid')
    
    // Clear previous previews
    grid.innerHTML = ''
    
    if (files.length > 0) {
      // Show the preview container
      container.classList.remove('hidden')
      
      // Limit to 4 images
      const maxImages = Math.min(files.length, 4)
      
      for (let i = 0; i < maxImages; i++) {
        const file = files[i]
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          continue
        }
        
        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
          this.showError(`Image ${i + 1} is too large. Maximum size is 5MB.`)
          continue
        }
        
        const reader = new FileReader()
        
        reader.onload = (e) => {
          const imageContainer = document.createElement('div')
          imageContainer.className = 'relative group'
          
          imageContainer.innerHTML = `
            <div class="relative">
              <img src="${e.target.result}" 
                   class="w-full h-32 object-cover rounded-lg border border-gray-200" 
                   alt="Preview ${i + 1}">
              <button type="button" 
                      class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                      data-action="click->image-preview#removeImage"
                      data-index="${i}">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div class="mt-1 text-xs text-gray-500 truncate">
              ${file.name}
            </div>
            <div class="text-xs text-gray-400">
              ${this.formatFileSize(file.size)}
            </div>
          `
          
          grid.appendChild(imageContainer)
        }
        
        reader.readAsDataURL(file)
      }
      
      // Show warning if more than 4 images selected
      if (files.length > 4) {
        this.showError(`Only the first 4 images will be uploaded. You selected ${files.length} images.`)
      }
    } else {
      // Hide the preview container if no files
      container.classList.add('hidden')
    }
  }
  
  removeImage(event) {
    const index = parseInt(event.target.dataset.index)
    const fileInput = this.element.querySelector('input[type="file"]')
    const files = Array.from(fileInput.files)
    
    // Remove the file from the array
    files.splice(index, 1)
    
    // Create a new FileList (this is a bit tricky, so we'll recreate the input)
    const newInput = document.createElement('input')
    newInput.type = 'file'
    newInput.name = fileInput.name
    newInput.multiple = true
    newInput.accept = 'image/*'
    newInput.className = fileInput.className
    newInput.setAttribute('data-action', 'change->image-preview#preview')
    
    // Create a new DataTransfer object to hold the remaining files
    const dataTransfer = new DataTransfer()
    files.forEach(file => dataTransfer.items.add(file))
    newInput.files = dataTransfer.files
    
    // Replace the old input with the new one
    fileInput.parentNode.replaceChild(newInput, fileInput)
    
    // Trigger preview update
    this.preview({ target: newInput })
  }
  
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
  
  removeExistingImage(event) {
    console.log('removeExistingImage called!', event)
    console.log('Event target:', event.target)
    console.log('Event target dataset:', event.target.dataset)
    
    const imageId = event.target.dataset.imageId
    const imageContainer = event.target.closest('.relative.group')
    
    console.log('Image ID:', imageId)
    console.log('Image container:', imageContainer)
    
    if (confirm('Are you sure you want to remove this image?')) {
      // Create a hidden input to track removed images
      let removedImagesInput = document.getElementById('removed_image_ids')
      if (!removedImagesInput) {
        removedImagesInput = document.createElement('input')
        removedImagesInput.type = 'hidden'
        removedImagesInput.name = 'removed_image_ids[]'
        removedImagesInput.id = 'removed_image_ids'
        this.element.appendChild(removedImagesInput)
      }
      
      // Add the image ID to the removed images list
      const removedIds = removedImagesInput.value ? removedImagesInput.value.split(',') : []
      if (!removedIds.includes(imageId)) {
        removedIds.push(imageId)
        removedImagesInput.value = removedIds.join(',')
      }
      
      // Remove the image container from the UI
      imageContainer.remove()
      
      // Show success message
      this.showSuccess('Image will be removed when you save the post.')
      
      // Debug: log the removed IDs
      console.log('Removed image IDs:', removedImagesInput.value)
    }
  }
  
  showError(message) {
    // Create or update error message
    let errorDiv = document.getElementById('image-error-message')
    if (!errorDiv) {
      errorDiv = document.createElement('div')
      errorDiv.id = 'image-error-message'
      errorDiv.className = 'mt-2 p-3 bg-red-50 border border-red-200 rounded-lg'
      
      const container = document.getElementById('image-preview-container')
      container.parentNode.insertBefore(errorDiv, container)
    }
    
    errorDiv.innerHTML = `
      <div class="flex items-center">
        <svg class="w-4 h-4 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
        </svg>
        <span class="text-sm text-red-700">${message}</span>
      </div>
    `
    
    // Auto-hide error after 5 seconds
    setTimeout(() => {
      if (errorDiv) {
        errorDiv.remove()
      }
    }, 5000)
  }
  
  showSuccess(message) {
    // Create or update success message
    let successDiv = document.getElementById('image-success-message')
    if (!successDiv) {
      successDiv = document.createElement('div')
      successDiv.id = 'image-success-message'
      successDiv.className = 'mt-2 p-3 bg-green-50 border border-green-200 rounded-lg'
      
      const container = document.getElementById('image-preview-container')
      container.parentNode.insertBefore(successDiv, container)
    }
    
    successDiv.innerHTML = `
      <div class="flex items-center">
        <svg class="w-4 h-4 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
        </svg>
        <span class="text-sm text-green-700">${message}</span>
      </div>
    `
    
    // Auto-hide success after 3 seconds
    setTimeout(() => {
      if (successDiv) {
        successDiv.remove()
      }
    }, 3000)
  }
}
