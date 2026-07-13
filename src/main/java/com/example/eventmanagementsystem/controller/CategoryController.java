package com.example.eventmanagementsystem.controller;

import com.example.eventmanagementsystem.entity.Category;
import com.example.eventmanagementsystem.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/categories")
@CrossOrigin(origins = "*")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    // Create Category
    @PostMapping("/save")
    public Category saveCategory(@RequestBody Category category) {
        return categoryService.saveCategory(category);
    }

    // Get All Categories
    @GetMapping("/all")
    public List<Category> getAllCategories() {
        return categoryService.getAllCategories();
    }

    // Get Category By ID
    @GetMapping("/{id}")
    public Optional<Category> getCategoryById(@PathVariable Long id) {
        return categoryService.getCategoryById(id);
    }

    // Update Category
    @PutMapping("/update/{id}")
    public Category updateCategory(@PathVariable Long id,
                                   @RequestBody Category category) {
        return categoryService.updateCategory(id, category);
    }

    // Delete Category
    @DeleteMapping("/delete/{id}")
    public String deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return "Category deleted successfully";
    }

    // Search Category By Name
    @GetMapping("/search/{name}")
    public Category findCategory(@PathVariable String name) {
        return categoryService.findByCategoryName(name);
    }
}