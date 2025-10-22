# Forms

Form helpers provide elements for collecting user input. Build interactive forms with text inputs, dropdowns, checkboxes, radio buttons, and more.

## Functions

### form

Create a form container for collecting user input.

**Usage**:
```typescript
import { form, input, button, label } from 'rynex';

form(
  { onSubmit: (e) => handleSubmit(e) },
  label({ htmlFor: 'name' }, 'Name'),
  input({ id: 'name', type: 'text' }),
  button({ type: 'submit' }, 'Submit')
)
```

**Properties**:
- `onSubmit`: Form submission handler
- `method`: HTTP method (get, post)
- `action`: Form submission URL
- `enctype`: Encoding type for file uploads

### textarea

Create a multi-line text input field.

**Usage**:
```typescript
import { textarea, label } from 'rynex';

label(
  { htmlFor: 'message' },
  'Message'
)
textarea({
  id: 'message',
  placeholder: 'Enter your message',
  rows: 5,
  cols: 40
})
```

**Properties**:
- `placeholder`: Placeholder text
- `rows`: Number of visible rows
- `cols`: Number of visible columns
- `value`: Initial value
- `disabled`: Disable the textarea
- `onChange`: Change handler
- `onInput`: Input handler

### select

Create a dropdown list for selecting options.

**Usage**:
```typescript
import { select, option, label } from 'rynex';

label({ htmlFor: 'country' }, 'Country')
select(
  { id: 'country' },
  option({ value: 'us' }, 'United States'),
  option({ value: 'uk' }, 'United Kingdom'),
  option({ value: 'ca' }, 'Canada')
)
```

**Properties**:
- `value`: Selected option value
- `multiple`: Allow multiple selections
- `disabled`: Disable the select
- `onChange`: Change handler

### option

Create an option within a select dropdown.

**Usage**:
```typescript
import { option } from 'rynex';

option({ value: 'option1' }, 'Option 1')
option({ value: 'option2', disabled: true }, 'Option 2 (Disabled)')
```

**Properties**:
- `value`: Option value (required)
- `selected`: Pre-select this option
- `disabled`: Disable this option

### checkbox

Create a checkbox input for boolean selections.

**Usage - Single Checkbox**:
```typescript
import { checkbox, label } from 'rynex';

label(
  { htmlFor: 'agree' },
  checkbox({ id: 'agree' }),
  ' I agree to the terms'
)
```

**Usage - Multiple Checkboxes**:
```typescript
import { checkbox, label, div } from 'rynex';

div(
  {},
  label({}, checkbox({ name: 'interests' }), ' Sports'),
  label({}, checkbox({ name: 'interests' }), ' Music'),
  label({}, checkbox({ name: 'interests' }), ' Reading')
)
```

**Properties**:
- `checked`: Pre-check the checkbox
- `name`: Input name for form submission
- `value`: Checkbox value
- `disabled`: Disable the checkbox
- `onChange`: Change handler

### radio

Create a radio button for single selection from multiple options.

**Usage**:
```typescript
import { radio, label, div } from 'rynex';

div(
  {},
  label({}, radio({ name: 'gender' }), ' Male'),
  label({}, radio({ name: 'gender' }), ' Female'),
  label({}, radio({ name: 'gender' }), ' Other')
)
```

**Properties**:
- `name`: Input name (group related radios)
- `value`: Radio button value
- `checked`: Pre-select this radio
- `disabled`: Disable the radio
- `onChange`: Change handler

### fieldset

Group related form elements together.

**Usage**:
```typescript
import { fieldset, legend, label, input } from 'rynex';

fieldset(
  {},
  legend({}, 'Personal Information'),
  label({}, 'First Name'),
  input({ type: 'text' }),
  label({}, 'Last Name'),
  input({ type: 'text' })
)
```

**Properties**:
- `disabled`: Disable all form elements in the fieldset
- `name`: Fieldset name

### legend

Create a caption for a fieldset.

**Usage**:
```typescript
import { legend, text } from 'rynex';

legend({}, text('Contact Information'))
```

**Properties**:
- `class`: CSS class names

### datalist

Create a list of predefined options for an input field.

**Usage**:
```typescript
import { datalist, option, input } from 'rynex';

datalist(
  { id: 'browsers' },
  option({ value: 'Chrome' }),
  option({ value: 'Firefox' }),
  option({ value: 'Safari' })
)

input({
  type: 'text',
  list: 'browsers',
  placeholder: 'Choose a browser'
})
```

**Properties**:
- `id`: Datalist ID (required, referenced by input)

### meter

Display a measurement within a known range.

**Usage**:
```typescript
import { meter, text } from 'rynex';

text('Disk Usage: '),
meter({
  value: 75,
  min: 0,
  max: 100,
  low: 33,
  high: 66
})
```

**Properties**:
- `value`: Current value (required)
- `min`: Minimum value (default: 0)
- `max`: Maximum value (default: 100)
- `low`: Low threshold
- `high`: High threshold
- `optimum`: Optimal value

### progress

Display progress of a task.

**Usage**:
```typescript
import { progress, text } from 'rynex';

text('Loading: '),
progress({
  value: 65,
  max: 100
})
```

**Properties**:
- `value`: Current progress value
- `max`: Maximum value (default: 100)

### output

Display the result of a calculation or user action.

**Usage**:
```typescript
import { output, input, text } from 'rynex';

text('Result: '),
output(
  { htmlFor: 'x y' },
  text('0')
)
```

**Properties**:
- `htmlFor`: IDs of related input elements
- `name`: Output name

## Common Patterns

### Contact Form

```typescript
import { form, label, input, textarea, button, div } from 'rynex';

form(
  { onSubmit: handleSubmit },
  div(
    { class: 'form-group' },
    label({ htmlFor: 'name' }, 'Name'),
    input({ id: 'name', type: 'text', required: true })
  ),
  div(
    { class: 'form-group' },
    label({ htmlFor: 'email' }, 'Email'),
    input({ id: 'email', type: 'email', required: true })
  ),
  div(
    { class: 'form-group' },
    label({ htmlFor: 'message' }, 'Message'),
    textarea({ id: 'message', rows: 5 })
  ),
  button({ type: 'submit' }, 'Send')
)
```

### Survey Form

```typescript
import { form, fieldset, legend, label, radio, button } from 'rynex';

form(
  { onSubmit: handleSubmit },
  fieldset(
    {},
    legend({}, 'How satisfied are you?'),
    label({}, radio({ name: 'satisfaction' }), ' Very Satisfied'),
    label({}, radio({ name: 'satisfaction' }), ' Satisfied'),
    label({}, radio({ name: 'satisfaction' }), ' Neutral'),
    label({}, radio({ name: 'satisfaction' }), ' Dissatisfied')
  ),
  button({ type: 'submit' }, 'Submit')
)
```

### Preferences Form

```typescript
import { form, fieldset, legend, label, checkbox, button } from 'rynex';

form(
  { onSubmit: handleSubmit },
  fieldset(
    {},
    legend({}, 'Preferences'),
    label({}, checkbox({ name: 'newsletter' }), ' Subscribe to newsletter'),
    label({}, checkbox({ name: 'notifications' }), ' Enable notifications'),
    label({}, checkbox({ name: 'marketing' }), ' Allow marketing emails')
  ),
  button({ type: 'submit' }, 'Save')
)
```

### Search Form

```typescript
import { form, input, button } from 'rynex';

form(
  { onSubmit: handleSearch },
  input({
    type: 'search',
    placeholder: 'Search...',
    name: 'q'
  }),
  button({ type: 'submit' }, 'Search')
)
```

### File Upload Form

```typescript
import { form, label, input, button } from 'rynex';

form(
  { onSubmit: handleUpload, enctype: 'multipart/form-data' },
  label({ htmlFor: 'file' }, 'Choose File'),
  input({ id: 'file', type: 'file', accept: '.pdf,.doc' }),
  button({ type: 'submit' }, 'Upload')
)
```

### Dynamic Progress

```typescript
import { progress, text, state } from 'rynex';

const uploadProgress = state(0);

progress({
  value: uploadProgress.value,
  max: 100
})
```

## Form Validation

```typescript
import { form, input, button } from 'rynex';

form(
  { onSubmit: (e) => {
    e.preventDefault();
    // Validate form
  }},
  input({
    type: 'email',
    required: true,
    placeholder: 'Enter email'
  }),
  input({
    type: 'password',
    required: true,
    minLength: 8,
    placeholder: 'Enter password'
  }),
  button({ type: 'submit' }, 'Login')
)
```

## Accessibility Tips

- Always use `label` elements with `htmlFor` attribute
- Group related inputs with `fieldset` and `legend`
- Use `placeholder` for hints, not labels
- Provide clear error messages
- Use `required` attribute for mandatory fields
- Use appropriate input `type` attributes
- Ensure sufficient color contrast
- Make forms keyboard accessible

## Tips

- Use semantic form elements for better accessibility
- Group related inputs with fieldsets
- Always label form inputs
- Provide clear instructions and error messages
- Use appropriate input types for validation
- Consider mobile-friendly form layouts
- Test form submission and validation
- Use `disabled` attribute for unavailable options

## Next Steps

- Learn about [Basic Elements](./basic-elements.md) for form structure
- Explore [Components](./components.md) for advanced form components
- Check [Best Practices](../best-practices.md) for form design tips

## Related

- [Basic Elements](./basic-elements.md)
- [Components](./components.md)
- [Utilities](./utilities.md)
