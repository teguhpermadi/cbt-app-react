
import StarterKit from '@tiptap/starter-kit';

console.log('StarterKit Extensions:');
// StarterKit is a function/extension.
// If it is an Extension, we might need to inspect it differently.
// StarterKit.configure() returns an extension with configured items.
// Actually StarterKit is an Extension.
// It has `addExtensions()` method.
const sk = StarterKit.configure();
// But we cannot easily peek inside without instantiating editor usually.
// However, we can check the default config.
// Or just check if 'underline' is in the source.

// Simpler: iterate imports and see what happens.
// But wait, the warning is a runtime warning in the browser.

// Let's blindly try removing Underline if StarterKit has it.
// But standard StarterKit does NOT have it.

// Maybe multiple instances of the same extension class?
// If I import 'Underline' from '.../index.js' and '.../dist/index.js'?
// Unlikely.

// Let's just try to revert Underline to default import first.
