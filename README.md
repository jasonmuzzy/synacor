# Synacor Challenge

This repository holds my copy of the architecture specification and challenge
binary from the Synacor Challenge as presented at OSCON 2012.  It is preserved
for historical and educational purposes.  

## Usage

`npm run start`

## Codes

I have included MD5 hashes of the eight codes produced by this instance of the
challenge for use in testing implementations of the architecture.  These codes
can be validated as follows, replacing the quoted string with the code to test:

```console
$ echo -n "<Code Here>" | md5sum
6fcd818224b42f563e10b91b4f2a5ae8  -
```

- 76ec2408e8fe3f1753c25db51efd8eb3 -- 1. code from arch-spec (LDOb7UGhTi)
- 0e6aa7be1f68d930926d72b3741a145c -- 2. code from welcome (ImoFztWQCvxj)
- 7997a3b2941eab92c1c0345d5747b420 -- 3. code after successful self-test (BNCyODLfQkIl)
- 186f842951c0dcfe8838af1e7222b7d4 -- 4. use tablet (pWDWTEfURAdS)
- 2bf84e54b95ce97aefd9fc920451fc45 -- 5. from Twisty passages (rdMkyZhveeIv)
- e09640936b3ef532b7b8e83ce8f125f4 -- 6. use teleporter to Synacor HQ (JyDQhSbkpyns)
- 4873cf6b76f62ac7d5a53605b2535a0c -- 7. use teleporter to beach (NBlOWKLbTMgY)
- d0c54d4ed7f943280ce3e19532dbb1a6 -- 8. use miror (iW8UwOHpH8op --> qo8HqHOwU8Wi)