import { appConfig } from './app/app.config';
import { App } from './app/app';
import { bootstrapApplication } from '@angular/platform-browser';

/**
 * Google Translate DOM Mutation Guard
 *
 * Prevents NotFoundError crashes when Google Translate or Chrome Translate
 * mutates text nodes in the DOM (wrapping them in <font> tags).
 */
if (typeof Node !== 'undefined' && Node.prototype) {
  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function <T extends Node>(child: T): T {
    if (child.parentNode !== this) {
      if (child.parentNode) {
        child.parentNode.removeChild(child);
      }
      return child;
    }
    return originalRemoveChild.call(this, child) as T;
  };

  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function <T extends Node>(newNode: T, referenceNode: Node | null): T {
    if (referenceNode && referenceNode.parentNode !== this) {
      if (referenceNode.parentNode) {
        return referenceNode.parentNode.insertBefore(newNode, referenceNode) as T;
      }
      return this.appendChild(newNode) as T;
    }
    return originalInsertBefore.call(this, newNode, referenceNode) as T;
  };
}

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
