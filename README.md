# rlink

Reliably link local packages to any other local package for simpler development across multiple packages.

## WTF?

Automatic, Lerna-style linking to all of your package dependencies.

- Automatic package resolution; no manual specification or conventional directory structure expectations
- Works with relative dependency resolution because it doesn't use symlinks
- Works with packages you've already called `npm link` on

## Install

```sh
npm install -g treshugart/rlink
```

## Usage

If you have package A that depends on package B and want to link package B to package A:

- run `npm link` in package B
- run `rlink` in package A

Basically, do `npm link` in all packages you want to be able to link as you normally would with using `npm link package-name`, just use `rlink` instead.

## Coming soon

- specifying a list of packages to explicitly link
- unlinking

## Differences to...

So, I actually did some research into other things that might sate my need, but none of them quite fit the bill.

### feross/zelda

- Strict convention for directory structure doesn't work for everyone
- Uses symlinks which is the problem with `npm link package-name`

### tfennelly/slink

- Uses filesystem watchers in lieu of symlinks or Lerna-style linking
- Requires you specify which packages you want to link manually

### lerna/lerna

- Not everyone needs a mono-repo
