import { Component, effect, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { injectAllRecipes } from 'dataconnect-generated/js/default-connector/angular';

@Component({
  selector: 'app-recipes-public',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="recipes-container">
      <header class="recipes-header">
        <h1>Our Delicious Recipes</h1>
        <p class="subtitle">Explore our collection of amazing dishes</p>
      </header>

      <div class="loading-container" *ngIf="isLoading">
        <div class="loading-spinner"></div>
        <p>Loading recipes...</p>
      </div>

      <div class="no-recipes" *ngIf="recipes.length === 0 && !isLoading">
        <p>No recipes available at the moment. Check back soon!</p>
      </div>

      <div class="recipes-grid" *ngIf="recipes.length > 0">
        <div class="recipe-card" *ngFor="let recipe of recipes">
          <div class="recipe-header">
            <h2>{{ recipe.name }}</h2>
            <span class="recipe-badge"
              >{{ recipe.ingredients?.length || 0 }} ingredients</span
            >
          </div>

          <div
            class="recipe-content"
            [class.expanded]="expandedRecipes[recipe.id]"
          >
            <div class="recipe-section">
              <h3>Ingredients</h3>
              <ul class="ingredients-list">
                <li *ngFor="let ingredient of recipe.ingredients">
                  {{ ingredient }}
                </li>
                <li *ngIf="!recipe.ingredients?.length" class="empty-message">
                  No ingredients listed
                </li>
              </ul>
            </div>

            <div class="recipe-section">
              <h3>Preparation</h3>
              <ol class="steps-list">
                <li *ngFor="let step of recipe.steps">
                  {{ step }}
                </li>
                <li *ngIf="!recipe.steps?.length" class="empty-message">
                  No preparation steps listed
                </li>
              </ol>
            </div>
          </div>

          <button
            class="toggle-button"
            (click)="toggleRecipeDetails(recipe.id)"
          >
            {{ expandedRecipes[recipe.id] ? 'Show less' : 'Show more' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .recipes-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem 1rem;
      }

      .recipes-header {
        text-align: center;
        margin-bottom: 2rem;
      }

      h1 {
        font-size: 2.5rem;
        color: #2c3e50;
        margin-bottom: 0.5rem;
      }

      .subtitle {
        font-size: 1.2rem;
        color: #7f8c8d;
        margin: 0;
      }

      .recipes-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 2rem;
      }

      .recipe-card {
        background: white;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
        overflow: hidden;
        transition: transform 0.3s, box-shadow 0.3s;
        display: flex;
        flex-direction: column;
      }

      .recipe-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
      }

      .recipe-header {
        padding: 1.5rem 1.5rem 0.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #f0f0f0;
      }

      .recipe-header h2 {
        margin: 0;
        font-size: 1.4rem;
        color: #2c3e50;
      }

      .recipe-badge {
        background: #f39c12;
        color: white;
        font-size: 0.75rem;
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-weight: 600;
      }

      .recipe-content {
        padding: 1rem 1.5rem;
        max-height: 200px;
        overflow: hidden;
        transition: max-height 0.5s ease;
      }

      .recipe-content.expanded {
        max-height: 2000px;
      }

      .recipe-section {
        margin-bottom: 1.5rem;
      }

      h3 {
        font-size: 1.1rem;
        color: #34495e;
        margin: 0 0 0.75rem;
        border-left: 3px solid #2ecc71;
        padding-left: 0.75rem;
      }

      .ingredients-list,
      .steps-list {
        margin: 0;
        padding-left: 1.5rem;
      }

      .ingredients-list li,
      .steps-list li {
        margin-bottom: 0.5rem;
        line-height: 1.5;
        color: #555;
      }

      .steps-list li {
        padding-left: 0.5rem;
      }

      .toggle-button {
        margin-top: auto;
        background: transparent;
        color: #3498db;
        border: none;
        border-top: 1px solid #f0f0f0;
        padding: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s;
        text-align: center;
      }

      .toggle-button:hover {
        background: #f8f9fa;
      }

      .empty-message {
        color: #95a5a6;
        font-style: italic;
      }

      .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 3rem;
        color: #7f8c8d;
      }

      .loading-spinner {
        width: 40px;
        height: 40px;
        border: 4px solid rgba(0, 0, 0, 0.1);
        border-left-color: #3498db;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 1rem;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      .no-recipes {
        text-align: center;
        padding: 3rem;
        color: #7f8c8d;
        font-style: italic;
        background: white;
        border-radius: 12px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
      }

      @media (max-width: 768px) {
        .recipes-grid {
          grid-template-columns: 1fr;
        }

        h1 {
          font-size: 2rem;
        }
      }
    `,
  ],
})
export class RecipesPublicComponent {
  rm = injectAllRecipes();
  recipes: any[] = [];
  isLoading = false;
  expandedRecipes: Record<string, boolean> = {};

  constructor(private cdr: ChangeDetectorRef) {
    this.loadRecipes();
  }

  loadRecipes() {
    this.isLoading = true;

    effect(() => {
      const isDataLoading = this.rm.isLoading();
      this.cdr.detectChanges();
      this.isLoading = isDataLoading;

      if (!isDataLoading) {
        try {
          const data = this.rm.data();
          this.recipes = data?.recipes || [];
          console.log('Recipes loaded for public view:', data);
          this.isLoading = false;

          // Initialize expanded state for each recipe
          this.recipes.forEach((recipe) => {
            this.expandedRecipes[recipe.id] = false;
          });
        } catch (error) {
          if (this.rm.isError()) {
            console.error('Error loading recipes:', this.rm.error());
          } else {
            console.error('Unknown error:', error);
          }
          this.isLoading = false;
        }
      } else {
        console.log('Loading recipes...');
      }
    });
  }

  toggleRecipeDetails(recipeId: string) {
    this.expandedRecipes[recipeId] = !this.expandedRecipes[recipeId];
  }
}
