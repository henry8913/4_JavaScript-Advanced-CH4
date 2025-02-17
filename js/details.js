
document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    
    if (id) {
        try {
            const response = await fetch(`https://striveschool-api.herokuapp.com/books/${id}`);
            const book = await response.json();
            
            document.getElementById('book-details').innerHTML = `
                <div class="row">
                    <div class="col-md-4">
                        <img src="${book.img}" alt="${book.title}" class="img-fluid rounded">
                    </div>
                    <div class="col-md-8">
                        <h1 class="mb-4">${book.title}</h1>
                        <p class="mb-3"><strong>Category:</strong> ${book.category}</p>
                        <p class="mb-3"><strong>Price:</strong> $${book.price}</p>
                        <p class="mb-3"><strong>ASIN:</strong> ${book.asin}</p>
                        <a href="index.html" class="btn btn-primary">Back to Home</a>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Error fetching book details:', error);
        }
    }
});
