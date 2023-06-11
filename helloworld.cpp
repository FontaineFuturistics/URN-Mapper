#include <iostream>
// Need to get JSONcpp to handle JSON in c++
// HTTP/HTML in C++ is going to be above me without understanding the c++ syntax

// Forward declare method adder
int adder(int a, int b);

// Main function
int main() {

    // Run the method
    int i = adder(2, 2);

    // Print the output
    std::cout << "Your value is:\n";

    std::cout << i;

    //Return
    return 0;

}

// Basic addition function
int adder(int a, int b) {

    return a + b;

}