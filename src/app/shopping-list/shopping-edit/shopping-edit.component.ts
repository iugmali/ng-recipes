import {Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Ingredient} from "../../shared/ingredient.model";
import {ShoppingListService} from "../shopping-list.service";
import {NgForm} from "@angular/forms";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.scss']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', {static: false}) shoppingListForm: NgForm
  @ViewChild('ingredientName', {static: false}) ingredientName: ElementRef

  subscription: Subscription
  editMode = false
  editedItemIndex: number
  editedItem: Ingredient

  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit() {
    this.subscription = this.shoppingListService.startedEditing.subscribe(
      (index) => {
        this.editedItemIndex = index
        this.editMode = true
        this.editedItem = this.shoppingListService.getIngredient(index)
        this.shoppingListForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        })
      }
    )
  }

  onSubmit(form: NgForm) {
    const newIngredient = new Ingredient(form.value.name, form.value.amount);
    if (!this.editMode) {
      this.shoppingListService.addIngredient(newIngredient)
    } else {
      this.shoppingListService.updateIngredient(this.editedItemIndex, newIngredient)
    }
    this.editMode = false
    form.reset()
    this.ingredientName.nativeElement.focus()
  }

  onClear() {
    this.shoppingListForm.reset()
    this.editMode = false
    this.ingredientName.nativeElement.focus()
  }

  onDelete() {
    if (this.editMode) {
      this.shoppingListService.deleteIngredient(this.editedItemIndex)
    }
    this.onClear()
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }
}
