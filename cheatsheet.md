# Supergraphs with Rover CLI

# Rover CLI

Here are some common commands that you'll use with the Rover CLI.

## Installing the Rover CLI

```bash
curl -sSL https://rover.apollo.dev/nix/latest | sh
```

## Authenticating with Rover

```bash
rover config auth
```

Once you run this, you'll paste your API Key!

```bash
rover config whoami
```

## Checking a Schema

```bash
rover subgraph check YOUR_GRAPH_REF \
  --routing-url https://snowtooth-mountain-lifts.herokuapp.com/ \
  --schema ./lifts-schema.graphql \
  --name lifts
```

## Publishing a Schema

```bash
rover subgraph publish YOUR_GRAPH_REF \
  --routing-url https://snowtooth-mountain-lifts.herokuapp.com/ \
  --schema ./lifts-schema.graphql \
  --name lifts
```
