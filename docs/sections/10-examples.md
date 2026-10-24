## Examples

### 1. Post Tags with Suggestions

Plain tag names, suggestions from the database, and new tags allowed.

- ===Component

  ```php title="app/Http/Livewire/PostForm.php"
  <?php

  namespace App\Http\Livewire;

  use App\Models\Post;
  use App\Models\Tag;
  use Livewire\Component;

  class PostForm extends Component
  {
      public Post $post;

      public $tags = [];

      public function mount(Post $post)
      {
          $this->post = $post;
          $this->tags = $post->tags()->pluck('name')->all();
      }

      public function save()
      {
          $this->validate(['tags' => 'array|max:10', 'tags.*' => 'string|max:30']);

          $ids = collect($this->tags)->map(fn ($name) => Tag::firstOrCreate(['name' => $name])->id);
          $this->post->tags()->sync($ids);
      }

      public function render()
      {
          return view('livewire.post-form', ['suggestions' => Tag::orderBy('name')->pluck('name')]);
      }
  }
  ```

- ===View

  ```blade title="resources/views/livewire/post-form.blade.php"
  <form wire:submit.prevent="save">
      <label for="tags">Tags</label>

      <div wire:ignore>
          <input id="tags" data-pharaonic="tagify" wire:model="tags" data-direct data-max="10"
                 data-suggest-list='@json($suggestions)' placeholder="Add tags">
      </div>

      @error('tags') <span class="text-danger">{{ $message }}</span> @enderror

      <button type="submit">Save</button>
  </form>
  ```

### 2. Assign Users by Id

Suggestions are objects; the property holds user ids, and the field shows names.

```blade title="resources/views/livewire/task-form.blade.php"
<div wire:ignore>
    <input data-pharaonic="tagify" wire:model="assignees" data-direct data-key="id" data-value="name"
           data-suggest-enforce
           data-suggest-list='@json($users->map(fn ($user) => ["id" => $user->id, "value" => (string) $user->id, "name" => $user->name]))'>
</div>
```

`$assignees = [3, 7]` shows the names of users 3 and 7, and picking another user adds its id.

### 3. A Searchable Single Choice

```blade title="resources/views/livewire/shipping.blade.php"
<div wire:ignore>
    <input data-pharaonic="tagify" wire:model="country" data-direct data-value="name"
           data-options='@json(["mode" => "select", "enforceWhitelist" => true, "dropdown" => ["enabled" => 0], "whitelist" => $countries])'>
</div>
```

With `$countries` as `[['value' => 'eg', 'name' => 'Egypt'], ...]`, `$country` holds `"eg"` or `null`.

### 4. Mentions in a Comment

```blade title="resources/views/livewire/comment-box.blade.php"
<div wire:ignore>
    <textarea data-pharaonic="tagify" wire:model="body"
              data-options='@json(["mode" => "mix", "pattern" => "@", "whitelist" => $members, "dropdown" => ["enabled" => 1, "position" => "text"]])'></textarea>
</div>

<button wire:click="post">Post</button>
```

`$body` holds the text with each mention written as `[[{"value":"Mona","prefix":"@"}]]`. See [Select and Mix Modes](#modes) to read the mentions on the server.

### 5. Email Recipients

Typed or pasted addresses split on commas, semicolons, and spaces, and only valid ones become tags.

```blade title="resources/views/livewire/invite.blade.php"
<div wire:ignore>
    <input data-pharaonic="tagify" wire:model="emails" data-direct data-delimiters=",|;| "
           data-options='{"pattern": "^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$", "keepInvalidTags": false}'>
</div>
```
