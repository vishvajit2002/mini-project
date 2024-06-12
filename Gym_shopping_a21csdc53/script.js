<!-- Your existing HTML content -->

<script>
    // Initialize an array to store cart items
    let cartItems = [];

    // Function to add an item to the cart
    function addToCart() {
        // Assuming you have product details available, modify this accordingly
        const productDetails = {
            name: "Product Name",
            price: 19.99 // Replace with the actual price
            // Add more details as needed
        };

        // Add the item to the cart
        cartItems.push(productDetails);

        // Update the cart UI
        updateCart();
    }

    // Function to handle "Buy Now" action
    function buyNow() {
        // Similar to addToCart, you can implement specific "Buy Now" logic here
        // For example, redirect to a checkout page or perform additional actions
        console.log("Buy Now clicked");
    }

    // Function to update the cart UI
    function updateCart() {
        // Get the cart and cart items elements
        const cart = document.getElementById("cart");
        const cartItemsList = document.getElementById("cart-items");

        // Clear the existing cart items
        cartItemsList.innerHTML = '';

        // Populate the cart items dynamically
        cartItems.forEach(item => {
            const cartItem = document.createElement("li");
            cartItem.textContent = `${item.name} - $${item.price.toFixed(2)}`;
            cartItemsList.appendChild(cartItem);
        });

        // Show or hide the cart based on the number of items
        cart.style.display = cartItems.length > 0 ? "block" : "none";
    }
</script>
