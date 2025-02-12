document.addEventListener('DOMContentLoaded', () => {
    const reviewsContainer = document.getElementById('reviews-container');
    const submitButton = document.getElementById('submit-button');
    const reviewForm = document.getElementById('review-form'); // Get the form element

    // Function to create a review card element
    function createReviewCard(review) {
        const reviewCard = document.createElement('div');
        reviewCard.classList.add('review-card');

        reviewCard.innerHTML = `
            <h3>${review.title}</h3>
            <p>${review.content}</p>
            <p>Rating: ${review.rating}/5</p>
            <p class="timestamp">Posted on: ${new Date(review.createdAt).toLocaleDateString()}</p>
        `;

        return reviewCard;
    }

    // Function to fetch and display reviews
    async function fetchReviews() {
        try {
            const response = await fetch('http://localhost:5000/api/reviews');

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new TypeError("Expected JSON but got " + contentType);
            }

            const reviews = await response.json();

            reviewsContainer.innerHTML = '';

            if (Array.isArray(reviews)) {
                reviews.forEach(review => {
                    const card = createReviewCard(review);
                    reviewsContainer.appendChild(card);
                });
            } else {
                console.error("Reviews data is not an array:", reviews);
                reviewsContainer.innerHTML = '<p>Error: Invalid data format from server.</p>';
            }

        } catch (error) {
            console.error('Error fetching reviews:', error);
            reviewsContainer.innerHTML = '<p>Error loading reviews.</p>';
        }
    }

    // Function to submit a new review
    async function submitReview() {
        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;
        const rating = document.getElementById('rating').value;

        submitButton.disabled = true;
        submitButton.textContent = "Submitting...";

        try {
            const response = await fetch('http://localhost:5000/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, content, rating })
            });

            if (response.ok) {
                fetchReviews();
                document.getElementById('title').value = '';
                document.getElementById('content').value = '';
                document.getElementById('rating').value = '5';
                // Clear any previous error messages
                clearErrorMessage();

            } else {
                //  Attempt to parse the error message from the response
                try {
                    const errorData = await response.json();
                    displayErrorMessage(errorData.message || `Failed to submit review: ${response.status}`);
                } catch (parseError) {
                    console.error("Error parsing error message:", parseError);
                    displayErrorMessage(`Failed to submit review: ${response.status}`);
                }
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            displayErrorMessage('Failed to submit review.');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = "Submit Review";
        }
    }

    // Function to display error messages in the form
    function displayErrorMessage(message) {
        let errorDiv = document.getElementById('error-message');

        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.id = 'error-message';
            errorDiv.style.color = 'red';  // Style the error message
            reviewForm.parentNode.insertBefore(errorDiv, reviewForm.nextSibling); // Insert after form
        }
        errorDiv.textContent = message;
    }
    // Function to clear the error message
    function clearErrorMessage() {
        const errorDiv = document.getElementById('error-message');
        if (errorDiv) {
            errorDiv.remove();  // Remove the error message element
        }
    }

    // Event listener for the submit button
    submitButton.addEventListener('click', submitReview);

    // Initial fetch of reviews when the page loads
    fetchReviews();
});




