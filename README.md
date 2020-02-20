# react-native-unsplash

Online photos gallery search using Unplash

## Installation

1. [Register](https://unsplash.com/developers) you developer account for Unsplash API

2. [Create](https://unsplash.com/oauth/applications) a new app on Unsplash

3. Go to the **Keys** section of your app's page and copy your keys into a new file.
```typescript
const UnsplashKeys = {
  accessKey: 'MgllgRq7xd3TYgttzB1esqxfnFvC90sn9HLbUTRWclw',
  secretKey: 'E0BCAZUBPNQqc0UvpCxkOuHDNbSzAaxXqscX-kSHxks',
};

export default UnsplashKeys;
```
> Remeber to keep this file in local

4. Install this package
```bash
yarn add react-native-unsplash
```

## Basic Usage

```tsx
onOnlinePhotoSelect() {
    
}

<UnsplashSearch onPhotoSelect={this.onOnlinePhotoSelect/>

```