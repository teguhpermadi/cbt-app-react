
import StarterKit from '@tiptap/starter-kit';
import * as UnderlineModule from '@tiptap/extension-underline';

// Check if StarterKit has configure method which returns extension
// Or it typically has a list
// StarterKit is an Extension itself which has added extensions.
// We can access them if we create it? No.
// Let's print what StarterKit is.
console.log('StarterKit:', StarterKit);

// Check Underline exports
console.log('UnderlineModule keys:', Object.keys(UnderlineModule));
if (UnderlineModule.default) {
    console.log('UnderlineModule.default:', UnderlineModule.default.name);
}
if (UnderlineModule.Underline) {
    console.log('UnderlineModule.Underline:', UnderlineModule.Underline.name);
}
