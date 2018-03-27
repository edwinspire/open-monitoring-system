# @dojo/interfaces

[![Build Status](https://travis-ci.org/dojo/interfaces.svg?branch=master)](https://travis-ci.org/dojo/interfaces)
[![npm version](https://badge.fury.io/js/%40dojo%2Finterfaces.svg)](https://badge.fury.io/js/%40dojo%2Finterfaces)

<!--
[![codecov](https://codecov.io/gh/dojo/interfaces/branch/master/graph/badge.svg)](https://codecov.io/gh/dojo/interfaces)
[![npm version](https://badge.fury.io/js/@dojo/interfaces.svg)](http://badge.fury.io/js/@dojo/interfaces)
-->

This package contain TypeScript interfaces and types that are widely used across Dojo 2 packages.  It is designed to make it
easier to maintain these interfaces as well as build code that integrates well with the rest of the Dojo 2 packages without
requiring a hard dependency on those other packages.

**WARNING** This is _beta_ software. While we do not anticipate significant changes to the API at this stage, we may feel the need to do so. This is not yet production ready, so you should use at your own risk.

- [Usage](#usage)
- [Features](#features)
  - [bases](#bases)
  - [core](#core)
  - [loader](#loader)
  - [shim](#shim)
  - [loader](#loader)
- [How do I contribute?](#how-do-I-contribute?)
  - [Installation](#installation)
  - [Testing](#testing)
- [Licensing information](#licensing-information)

## Usage

To use `@dojo/interfaces` install the package:

```bash
npm install @dojo/interfaces
```

## Features

### bases

`Evented` and `Destroyable` interfaces, which are used throughout many packages, specifically`@dojo/core` and `@dojo/widget-core`.

`Evented` defines an interface for objects that emit events, while `Destroyable` defines an interface for objects that have `own` and `destroy` methods.

### core

Common, foundational interfaces used widely throughout most Dojo 2 packages. Includes `Handle` and event related interfaces `EventObject`, and `EventTargettedObject`.

### loader

Interfaces for working with `@dojo/loader`.  If the loader is included on the page, you can reference the loader with:

```typescript
import { DojoRequire } from '@dojo/interfaces/loader';
declare const require: DojoRequire;

require(['some-module'], (someModule) => {
});
```

### shim

`Thenable` and `ArrayLike` interfaces. `Thenable` will allow you to use promise-like objects without pulling in `@dojo/shim`.

### vdom

A set of interfaces for working with widgets and the virtual DOM. To work with a `VNode`:

```typescript
import { VNode } from '@dojo/interfaces/vdom';

let node: VNode;

node = someFlag ? v('div') : v('p');
```

## How do I contribute?

We appreciate your interest!  Please see the [Dojo 2 Meta Repository](https://github.com/dojo/meta#readme) for the
Contributing Guidelines.

### Code Style

This repository uses [`prettier`](https://prettier.io/) for code styling rules and formatting. A pre-commit hook is installed automatically and configured to run `prettier` against all staged files as per the configuration in the projects `package.json`.

An additional npm script to run `prettier` (with write set to `true`) against all `src` and `test` project files is available by running:

```bash
npm run prettier
```

### Installation

To start working with this package, clone the repository and run `npm install`.

In order to build the project run `grunt dev` or `grunt dist`.

### Testing

Since this is a type only package, we are currently working on the best way to test this package.

## Licensing information

© 2017 [JS Foundation](https://js.foundation/). [New BSD](http://opensource.org/licenses/BSD-3-Clause) license.
