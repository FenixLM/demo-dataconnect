import { Component, effect, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormArray,
} from '@angular/forms';
import {
  injectAllRecipes,
  injectCreateRecipe,
  injectUpsertRecipe,
} from 'dataconnect-generated/js/default-connector/angular';

@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page-wrapper">
      <div class="header-actions">
        <h2>Manage Recipes</h2>
        <button class="add-button" (click)="showAddForm()">Add Recipe</button>
      </div>

      <div class="panel" *ngIf="showForm">
        <h3>{{ editMode ? 'Edit Recipe' : 'Add New Recipe' }}</h3>
        <form [formGroup]="recipeForm" (ngSubmit)="submitForm()">
          <div class="form-grid">
            <div class="form-group full-width">
              <label for="name">Recipe Name</label>
              <input
                type="text"
                id="name"
                formControlName="name"
                class="form-control"
              />
              <div
                *ngIf="
                  recipeForm.get('name')?.invalid &&
                  recipeForm.get('name')?.touched
                "
                class="error-message"
              >
                Recipe name is required
              </div>
            </div>
          </div>

          <div class="section-header">
            <h4>Ingredients</h4>
            <button
              type="button"
              class="small-button"
              (click)="addIngredient()"
            >
              Add Ingredient
            </button>
          </div>

          <div formArrayName="ingredients">
            <div
              *ngFor="let ingredient of getIngredientsControls(); let i = index"
              class="ingredient-row"
            >
              <div class="form-group flex-grow">
                <input
                  type="text"
                  [formControlName]="i"
                  class="form-control"
                  placeholder="Enter ingredient"
                />
              </div>
              <button
                type="button"
                class="remove-button"
                (click)="removeIngredient(i)"
              >
                ✕
              </button>
            </div>
            <div
              *ngIf="getIngredientsControls().length === 0"
              class="empty-section"
            >
              No ingredients added yet. Click "Add Ingredient" to start.
            </div>
          </div>

          <div class="section-header">
            <h4>Steps</h4>
            <button type="button" class="small-button" (click)="addStep()">
              Add Step
            </button>
          </div>

          <div formArrayName="steps">
            <div
              *ngFor="let step of getStepsControls(); let i = index"
              class="step-row"
            >
              <div class="step-number">{{ i + 1 }}.</div>
              <div class="form-group flex-grow">
                <textarea
                  [formControlName]="i"
                  class="form-control textarea"
                  placeholder="Describe this step"
                  rows="2"
                ></textarea>
              </div>
              <button
                type="button"
                class="remove-button"
                (click)="removeStep(i)"
              >
                ✕
              </button>
            </div>
            <div *ngIf="getStepsControls().length === 0" class="empty-section">
              No steps added yet. Click "Add Step" to start.
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="cancel-button" (click)="cancelForm()">
              Cancel
            </button>
            <button type="submit" [disabled]="recipeForm.invalid || isLoading">
              {{ isLoading ? 'Saving...' : 'Save Recipe' }}
            </button>
          </div>
        </form>
      </div>

      <div class="table-wrapper">
        <table class="data-table" *ngIf="recipes.length > 0">
          <thead>
            <tr>
              <th>Recipe Name</th>
              <th>Ingredients</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let recipe of recipes">
              <td>{{ recipe.name }}</td>
              <td>
                <span *ngIf="recipe.ingredients?.length">
                  {{ recipe.ingredients?.length }} ingredients
                </span>
                <span *ngIf="!recipe.ingredients?.length">No ingredients</span>
              </td>
              <td class="actions-cell">
                <button class="action-button edit" (click)="editRecipe(recipe)">
                  Edit
                </button>
                <button
                  class="action-button delete"
                  (click)="deleteRecipe(recipe)"
                >
                  Delete
                </button>
                <button
                  class="action-button view"
                  (click)="viewRecipeDetails(recipe)"
                >
                  View
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="no-data" *ngIf="recipes.length === 0 && !isLoading">
          No recipes found. Add a recipe to get started.
        </div>

        <div class="loading" *ngIf="isLoading">Loading recipes...</div>
      </div>
    </div>
  `,
  styles: [
    `
      .page-wrapper {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .header-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      h2 {
        margin: 0;
        color: #333;
        font-weight: 500;
      }

      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 1.5rem 0 0.75rem;
      }

      h4 {
        margin: 0;
        color: #444;
        font-weight: 500;
      }

      .small-button {
        background-color: #4caf50;
        color: white;
        border: none;
        padding: 0.35rem 0.75rem;
        border-radius: 4px;
        font-size: 0.875rem;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.2s;
      }

      .small-button:hover {
        background-color: #45a049;
      }

      .add-button {
        background-color: #4caf50;
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 4px;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.2s;
      }

      .add-button:hover {
        background-color: #45a049;
      }

      .panel {
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        padding: 1.5rem;
      }

      h3 {
        margin-top: 0;
        margin-bottom: 1.5rem;
        font-weight: 500;
        color: #333;
      }

      .form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1rem;
      }

      .form-group {
        margin-bottom: 1rem;
      }

      .full-width {
        grid-column: 1 / -1;
      }

      label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
        color: #555;
      }

      .form-control {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
      }

      .error-message {
        color: #d32f2f;
        font-size: 0.875rem;
        margin-top: 0.25rem;
      }

      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        margin-top: 1.5rem;
      }

      .cancel-button {
        background-color: #f1f1f1;
        color: #333;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 4px;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.2s;
      }

      .cancel-button:hover {
        background-color: #e6e6e6;
      }

      button[type='submit'] {
        background-color: #4caf50;
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 4px;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.2s;
      }

      button[type='submit']:hover:not(:disabled) {
        background-color: #45a049;
      }

      button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }

      .table-wrapper {
        overflow-x: auto;
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .data-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.95rem;
      }

      .data-table th,
      .data-table td {
        padding: 0.75rem 1rem;
        text-align: left;
      }

      .data-table th {
        background-color: #f8f9fa;
        font-weight: 500;
        color: #555;
        border-bottom: 1px solid #dee2e6;
      }

      .data-table tr {
        border-bottom: 1px solid #f0f0f0;
      }

      .data-table tr:last-child {
        border-bottom: none;
      }

      .actions-cell {
        display: flex;
        gap: 0.5rem;
      }

      .action-button {
        border: none;
        padding: 0.5rem 0.75rem;
        border-radius: 4px;
        font-size: 0.875rem;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.2s;
      }

      .action-button.edit {
        background-color: #f8f9fa;
        color: #0275d8;
      }

      .action-button.edit:hover {
        background-color: #e9ecef;
      }

      .action-button.delete {
        background-color: #f8f9fa;
        color: #d9534f;
      }

      .action-button.delete:hover {
        background-color: #e9ecef;
      }

      .action-button.view {
        background-color: #f8f9fa;
        color: #5bc0de;
      }

      .action-button.view:hover {
        background-color: #e9ecef;
      }

      .no-data {
        text-align: center;
        padding: 2rem 0;
        color: #888;
      }

      .loading {
        text-align: center;
        padding: 2rem 0;
        color: #888;
      }

      .ingredient-row,
      .step-row {
        display: flex;
        align-items: center;
        margin-bottom: 0.75rem;
        gap: 0.5rem;
      }

      .flex-grow {
        flex-grow: 1;
      }

      .remove-button {
        background-color: #f8d7da;
        color: #dc3545;
        border: none;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .remove-button:hover {
        background-color: #f5c2c7;
      }

      .step-number {
        width: 24px;
        text-align: right;
        font-weight: 500;
        color: #666;
      }

      .textarea {
        resize: vertical;
        min-height: 60px;
      }

      .empty-section {
        color: #888;
        font-style: italic;
        padding: 0.75rem 0;
        border-bottom: 1px dashed #ddd;
      }
    `,
  ],
})
export class RecipesComponent {
  rm = injectAllRecipes();
  createRecipeMutation = injectCreateRecipe();
  upsertRecipeMutation = injectUpsertRecipe();
  recipes: any[] = [];
  recipeForm: FormGroup;
  showForm = false;
  editMode = false;
  currentRecipeId: string | null = null;
  isLoading = false;

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.recipeForm = this.createForm();
    this.loadRecipes();
  }

  createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required]],
      ingredients: this.fb.array([]),
      steps: this.fb.array([]),
    });
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
          console.log('Recipes loaded:', data);
          this.isLoading = false;
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

  // Form Array getters
  get ingredientsArray() {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  get stepsArray() {
    return this.recipeForm.get('steps') as FormArray;
  }

  getIngredientsControls() {
    return this.ingredientsArray.controls;
  }

  getStepsControls() {
    return this.stepsArray.controls;
  }

  // Ingredient methods
  addIngredient(value = '') {
    this.ingredientsArray.push(this.fb.control(value, Validators.required));
  }

  removeIngredient(index: number) {
    this.ingredientsArray.removeAt(index);
  }

  // Step methods
  addStep(value = '') {
    this.stepsArray.push(this.fb.control(value, Validators.required));
  }

  removeStep(index: number) {
    this.stepsArray.removeAt(index);
  }

  showAddForm() {
    this.editMode = false;
    this.currentRecipeId = null;
    this.resetForm();
    this.showForm = true;
  }

  resetForm() {
    this.recipeForm.reset();
    this.ingredientsArray.clear();
    this.stepsArray.clear();
  }

  editRecipe(recipe: any) {
    this.editMode = true;
    this.currentRecipeId = recipe.id;
    console.log('Editing recipe with ID:', this.currentRecipeId, recipe);

    this.resetForm();

    this.recipeForm.patchValue({
      name: recipe.name,
    });

    // Add existing ingredients
    if (recipe.ingredients && recipe.ingredients.length) {
      recipe.ingredients.forEach((ingredient: string) => {
        this.addIngredient(ingredient);
      });
    }

    // Add existing steps
    if (recipe.steps && recipe.steps.length) {
      recipe.steps.forEach((step: string) => {
        this.addStep(step);
      });
    }

    this.showForm = true;
  }

  async deleteRecipe(recipe: any) {
    if (confirm(`Are you sure you want to delete "${recipe.name}"?`)) {
      try {
        // Delete functionality would be implemented here
        // Since deletion mutation is not in your provided GraphQL mutations, we're just mocking this
        console.log('Deleting recipe:', recipe);

        // Remove from the local array
        this.recipes = this.recipes.filter((r) => r.id !== recipe.id);
      } catch (error) {
        console.error('Error deleting recipe:', error);
      }
    }
  }

  viewRecipeDetails(recipe: any) {
    // Navigate to recipe detail view (will be implemented later)
    console.log('Viewing recipe details:', recipe);
    // You could navigate to a detail page here
    // this.router.navigate(['/recipes', recipe.id]);
  }

  async submitForm() {
    if (this.recipeForm.invalid) return;

    this.isLoading = true;

    try {
      const formValue = this.recipeForm.value;

      // Prepare data for both operations
      const recipeData = {
        name: formValue.name,
        ingredients: formValue.ingredients,
        steps: formValue.steps,
      };

      console.log('Saving recipe:', recipeData);

      let result;
      if (this.editMode) {
        // Validate ID for update
        if (!this.currentRecipeId) {
          console.error('Cannot update recipe: Missing ID');
          this.isLoading = false;
          return;
        }

        console.log(
          'Updating recipe:',
          recipeData,
          'ID:',
          this.currentRecipeId
        );

        // Update existing recipe
        result = await this.upsertRecipeMutation.mutateAsync({
          id: this.currentRecipeId,
          ...recipeData,
        });

        if (result && result.recipe_upsert) {
          const updatedRecipeId = result.recipe_upsert.id;

          // Update in local array
          const index = this.recipes.findIndex(
            (r) => r.id === this.currentRecipeId
          );
          if (index !== -1) {
            this.recipes[index] = {
              id: updatedRecipeId,
              ...recipeData,
            };
          }
        }
      } else {
        // Create new recipe
        result = await this.createRecipeMutation.mutateAsync(recipeData);

        if (result && result.recipe_insert) {
          const newRecipeId = result.recipe_insert.id;

          // Add to local array
          this.recipes = [{ id: newRecipeId, ...recipeData }, ...this.recipes];
        }
      }

      this.cancelForm();
    } catch (error) {
      console.error(
        `Error ${this.editMode ? 'updating' : 'creating'} recipe:`,
        error
      );
    } finally {
      this.isLoading = false;
    }
  }

  cancelForm() {
    this.showForm = false;
    this.resetForm();
  }
}
