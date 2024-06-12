<?php
session_start();

// Check if the 'cart' session variable exists, if not, create it
if (!isset($_SESSION['cart'])) {
    $_SESSION['cart'] = array();
}

// Add the product to the cart
$product = array(
    'id' => $_POST['id'],
    'name' => $_POST['name'],
    'price' => $_POST['price']
);
array_push($_SESSION['cart'], $product);

// Return a success message
echo 'success';
?>
