document.addEventListener('DOMContentLoaded', () => {
    const featuredImage = document.getElementById('featuredImage');
    const thumbnails = document.querySelectorAll('.thumbnail');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const closeBtn = document.querySelector('.close-btn');
    const lightboxPrevBtn = document.getElementById('lightboxPrevBtn');
    const lightboxNextBtn = document.getElementById('lightboxNextBtn');
    const filterButtons = document.querySelectorAll('.filter-btn');

    let currentImageIndex = 0;
    let filteredImages = Array.from(thumbnails); // Initialize with all thumbnails

    // Function to update the featured image
    const updateFeaturedImage = (index) => {
        if (index < 0) {
            currentImageIndex = filteredImages.length - 1;
        } else if (index >= filteredImages.length) {
            currentImageIndex = 0;
        } else {
            currentImageIndex = index;
        }

        const newSrc = filteredImages[currentImageIndex].src;
        featuredImage.src = newSrc;
        lightboxImage.src = newSrc;

        // Update active thumbnail class
        thumbnails.forEach(thumb => thumb.classList.remove('active'));
        // Find the corresponding thumbnail in the original list to mark as active
        const originalIndex = Array.from(thumbnails).findIndex(
            thumb => thumb.src === filteredImages[currentImageIndex].src
        );
        if (originalIndex !== -1) {
            thumbnails[originalIndex].classList.add('active');
        }
    };

    // Thumbnail click handler
    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', () => {
            const thumbnailSrc = thumbnail.src;
            const clickedIndex = filteredImages.findIndex(img => img.src === thumbnailSrc);
            if (clickedIndex !== -1) {
                updateFeaturedImage(clickedIndex);
            }
        });
    });

    // Navigation buttons (main gallery)
    prevBtn.addEventListener('click', () => updateFeaturedImage(currentImageIndex - 1));
    nextBtn.addEventListener('click', () => updateFeaturedImage(currentImageIndex + 1));

    // Lightbox functionality
    featuredImage.addEventListener('click', () => {
        lightbox.classList.add('show');
        lightboxImage.src = featuredImage.src;
    });

    closeBtn.addEventListener('click', () => {
        lightbox.classList.remove('show');
    });

    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('show');
        }
    });

    // Lightbox navigation
    lightboxPrevBtn.addEventListener('click', () => updateFeaturedImage(currentImageIndex - 1));
    lightboxNextBtn.addEventListener('click', () => updateFeaturedImage(currentImageIndex + 1));

    // Keyboard navigation (Escape for close, Arrow keys for next/prev)
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('show')) {
            if (e.key === 'Escape') {
                lightbox.classList.remove('show');
            } else if (e.key === 'ArrowLeft') {
                updateFeaturedImage(currentImageIndex - 1);
            } else if (e.key === 'ArrowRight') {
                updateFeaturedImage(currentImageIndex + 1);
            }
        }
    });

    // Bonus: Image Filters/Categories
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all filter buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to the clicked button
            button.classList.add('active');

            const filter = button.dataset.filter;

            // Filter thumbnails based on category
            filteredImages = Array.from(thumbnails).filter(thumbnail => {
                if (filter === 'all') {
                    return true;
                }
                return thumbnail.dataset.category === filter;
            });

            // Show/hide thumbnails
            thumbnails.forEach(thumbnail => {
                if (filter === 'all' || thumbnail.dataset.category === filter) {
                    thumbnail.style.display = 'block'; // Or 'inline-block' depending on your layout
                } else {
                    thumbnail.style.display = 'none';
                }
            });

            // If no images in the filtered set, revert to all or handle gracefully
            if (filteredImages.length === 0) {
                console.warn("No images found for this filter. Displaying all images.");
                filteredImages = Array.from(thumbnails); // Fallback to all images
                thumbnails.forEach(thumbnail => thumbnail.style.display = 'block');
                document.querySelector('.filter-btn[data-filter="all"]').classList.add('active');
            }

            // Update featured image to the first one of the filtered set, or reset
            updateFeaturedImage(0);
        });
    });

    // Initial load: Set the first image as active
    updateFeaturedImage(0);
});