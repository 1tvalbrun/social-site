# Message Component Guide

This guide explains how to use the new `Message` component for displaying consistent error, success, and info messages throughout the application.

## Overview

The `Message` component provides a standardized way to display different types of messages to users, ensuring consistent styling and behavior across the application.

## Usage

### Basic Usage

```tsx
import { Message } from '@/components/common/message';

// Inside your component
return (
  <div>
    <Message
      message="Your action was successful!"
      type="success"
    />
  </div>
);
```

### Props

The `Message` component accepts the following props:

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `message` | string | Yes | The message text to display. If empty, the component won't render. |
| `type` | 'error' \| 'success' \| 'info' \| '' | Yes | The type of message to display. |
| `title` | string | No | Optional title for the message. |
| `className` | string | No | Additional CSS classes to apply to the component. |
| `icon` | boolean | No | Whether to show the type icon. Defaults to `true`. |
| `dismissible` | boolean | No | Whether the message can be dismissed with an X button. Defaults to `true` for error messages, `false` for others. |
| `onDismiss` | () => void | No | Callback function that runs when the dismiss button is clicked. |

### Message Types

There are three message types available:

1. **error** - Used for error messages, styled with red colors. Dismissible by default.
2. **success** - Used for success messages, styled with green colors
3. **info** - Used for informational messages, styled with blue colors

## Examples

### Error Message (Dismissible by Default)

```tsx
<Message
  message="Invalid username or password."
  type="error"
  title="Error"
/>
```

### Success Message (Not Dismissible by Default)

```tsx
<Message
  message="Your post was published successfully!"
  type="success"
  title="Success"
/>
```

### Dismissible Success Message

```tsx
<Message
  message="Your post was published successfully!"
  type="success"
  dismissible={true}
  title="Success"
/>
```

### Non-Dismissible Error Message

```tsx
<Message
  message="An error occurred. Please try again later."
  type="error"
  dismissible={false}
/>
```

### With Dismiss Callback

```tsx
<Message
  message="Your session will expire soon."
  type="info"
  dismissible={true}
  onDismiss={() => console.log("User dismissed the message")}
/>
```

### Info Message

```tsx
<Message
  message="You will be logged out after 30 minutes of inactivity."
  type="info"
/>
```

### Without Title

```tsx
<Message
  message="Please check your email to verify your account."
  type="info"
/>
```

### Without Icon

```tsx
<Message
  message="Profile updated successfully."
  type="success"
  icon={false}
/>
```

## In State-Based Components

For components that need to display messages based on state:

```tsx
const [error, setError] = useState<string | null>(null);
const [successMessage, setSuccessMessage] = useState<string | null>(null);

// When handling form submission
const handleSubmit = async () => {
  try {
    // API call or other logic
    setSuccessMessage("Operation successful!");
    
    // Optional: Clear success message after a delay
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
    
  } catch (error) {
    setError("Something went wrong. Please try again.");
  }
};

// In your JSX
return (
  <div>
    <Message 
      message={error || ''} 
      type="error" 
      onDismiss={() => setError(null)}
    />
    <Message message={successMessage || ''} type="success" />
    {/* Rest of your component */}
  </div>
);
```

## Best Practices

1. Use specific and actionable error messages
2. Keep success messages brief and positive
3. Clear messages after they're no longer relevant
4. Use info messages sparingly for important contextual information
5. Add titles for more complex messages
6. Group related form errors together in a single message
7. Make error messages dismissible so users can close them after reading
8. Provide an `onDismiss` callback to update your component state when needed

## Integration with Forms

For forms, place the message component between the form title and the form fields:

```tsx
<form onSubmit={handleSubmit}>
  <h2>Create Account</h2>
  
  <Message 
    message={formError} 
    type="error"
    onDismiss={() => setFormError('')}  
  />
  
  <div className="form-fields">
    {/* Form fields here */}
  </div>
  
  <button type="submit">Submit</button>
</form>
``` 