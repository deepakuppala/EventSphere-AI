package com.example.eventmanagementsystem.service;

import com.example.eventmanagementsystem.entity.Category;
import com.example.eventmanagementsystem.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    // Save Category
    public Category saveCategory(Category category) {
        return categoryRepository.save(category);
    }

    // Get All Categories
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    // Get Category By ID
    public Optional<Category> getCategoryById(Long id) {
        return categoryRepository.findById(id);
    }

    // Update Category
    public Category updateCategory(Long id, Category categoryDetails) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        category.setCategoryName(categoryDetails.getCategoryName());
        category.setDescription(categoryDetails.getDescription());

        return categoryRepository.save(category);
    }

    // Delete Category
    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }

    // Find By Category Name
    public Category findByCategoryName(String categoryName) {
        return categoryRepository.findByCategoryName(categoryName);
    }
}