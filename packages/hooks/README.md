# Internal hooks

This is a collection of [internal](https://turbo.build/repo/docs/handbook/sharing-code/internal-packages) hooks that are used by the `mvns` monorepo.

These hooks are not meant to be used externally. If we decide to publicize them, we should use this guide:
https://turbo.build/repo/docs/handbook/publishing-packages

## Documentation

- [useObjectUrl](docs/use-object-url.md) - Create an object URL for a `File`, `Blob`, or a `MediaSource`.
- [useQueryParams](docs/use-query-params.md) - Parse (and optionally, remove) query parameters in the URL.
- [useWaitFor](docs/use-wait-for.md) - Poll a function until a timeout is reached.
