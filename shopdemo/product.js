const PRODUCTS = [
  {
    id: "vidallamp",
    scene: "aHR0cHM6Ly9wcm9kdWN0LjNkdHdpbnMudGVjaC8/bmFtZT12aWRhbGxhbXAmY29uZmlnPU9iamVjdF8yJTNBJTIzZmZmYmI5JTdDQ3VlcnBvJTNBJTIzYWE3OTQyJTdDQyVDMyVCQXB1bGElM0ElMjNmZmZmZmYlN0NPYmplY3RfNSUzQSUyM2ZmNjI1MSU3Q1RhbGxvX21ldCVDMyVBMWxpY28lM0ElMjMwMDAwMDAlN0NCYXNlX2VzdHJ1Y3R1cmElM0ElMjMyMzIzMjMmcXVhbnRpdHk9MSZ0b2tlbj1lMWJkNzlkYS1kYzdlLTQ4NmQtYmQwZS03NmVkOGM4Mzc5ODEmbW9kZWxVcmw9aHR0cHMlM0ElMkYlMkZkZW1vLjNkdHdpbnMuZXUlMkZ2aWRhbGxhbXAuZ2xiJmJ1eVVSTD1odHRwcyUzQSUyRiUyRjNkdHdpbnMuZXMlMkY=",
    title: "vidallamp",
    price: "179€",
    image: "sources/democonfigurador3dluminaria.png",
    meta: "Printing On demand",
   type: ["vh", "grid"],
    tags: ["lamp", "lighting", "design", "minimal", "3d","de mesa",]
  },
  {
    id: "Mantra",
    scene: "aHR0cHM6Ly9wcm9kdWN0LjNkdHdpbnMudGVjaC8/bmFtZT1NYW50cmEmY29uZmlnPUhvbWFrY29tYnJfRFNHTjcyNV9NYXRlcmlhbF8lMjMzNzlfMCUzQSUyM2QyOWQwMCU3Q0hvbWFrY29tYnJfRFNHTjcyNV9QcmV0b18yXzAlM0ElMjNkNTg0MDAlN0NjYWJlemFfZGVfbWFkZXJhJTNBJTIzZmZlNGE4JTdDQXJjbyUzQSUyMzIzMjMyMyU3Q1JlY3RhbmdsZTAwM19Db3Vyb19NYXJyb21fMCUzQSUyMzIzMjMyMyU3Q0N5bGluZGVyMDA4X01hZGVpcmFfQ2xhcmFfMCUzQSUyM2ZmZTRhOCU3Q0N5bGluZGVyMDA5X01hdGVyaWFsXyUyMzE5XzAlM0ElMjMwMDJlN2ElN0NDeWxpbmRlcjAxMF9NYXRlcmlhbF8lMjMxOV8wJTNBJTIzMDAyZTdhJTdDQ3VwdWxhJTNBJTIzMDAyZTdhJTdDTGluZTM3Nl9NYXRlcmlhbF8lMjMyN18wJTNBJTIzZmZmZmZmJnF1YW50aXR5PTEmdG9rZW49OThkNGExNWEtMGFmNS00ZjU5LWI5NzYtNWUxYzU5NGE1NWE3Jm1vZGVsVXJsPWh0dHBzJTNBJTJGJTJGZGVtby4zZHR3aW5zLmV1JTJGTWFudHJhLmdsYiZidXlVUkw9aHR0cHMlM0ElMkYlMkYzZHR3aW5zLmVzJTJG",
    title: "Mantra",
    price: "160€",
    image: "sources/mantra_azul.png",
    meta: "Printing On demand",
    type: ["vh", "grid"],
     tags: ["lamp", "lighting", "design", "minimal", "3d", "azul",]
  },

  {
    id: "Egglamp",
    scene: "aHR0cHM6Ly9wcm9kdWN0LjNkdHdpbnMudGVjaC8/bmFtZT1FZ2dsYW1wJmNvbmZpZz1idWxiMl9MYW1wXzAlM0ElMjNjY2NjY2MlN0NmbG93ZXJiMl9ncmVlbl9wYWludF8wJTNBJTIzZmY0MDEzJTdDc3RyYW5kM19ncmVlbl9wYWludF8wJTNBJTIzZmY0MDEzJTdDYnVsYjNfTGFtcF8wJTNBJTIzY2NjY2NjJTdDZmxvd2VyYjNfZ3JlZW5fcGFpbnRfMCUzQSUyM2ZmNDAxMyU3Q3N0cmFuZDJfZ3JlZW5fcGFpbnRfMCUzQSUyM2ZmNDAxMyU3Q2J1bGIxX0xhbXBfMCUzQSUyM2NjY2NjYyU3Q2Zsb3dlcmIxX2dyZWVuX3BhaW50XzAlM0ElMjNmZjQwMTMlN0NMZWF2ZTBfZ3JlZW5fcGFpbnRfMCUzQSUyM2ZmNDAxMyU3Q0xlYXZlMV9ncmVlbl9wYWludF8wJTNBJTIzZmY0MDEzJTdDTGVhdmUyX2dyZWVuX3BhaW50XzAlM0ElMjNmZjQwMTMlN0NMZWF2ZTNfZ3JlZW5fcGFpbnRfMCUzQSUyM2ZmNDAxMyU3Q3N0cmFuZDFfZ3JlZW5fcGFpbnRfMCUzQSUyM2ZmNDAxMyU3Q0Jhc2VfZ3JlZW5fcGFpbnRfMCUzQSUyM2ZmNDAxMyZxdWFudGl0eT0xJnRva2VuPTNmZTU0ZGI4LTdkNmQtNDYxYi1iOWE1LWQ0ZDE2ZWIzNjZlOSZtb2RlbFVybD1odHRwcyUzQSUyRiUyRmRlbW8uM2R0d2lucy5ldSUyRkVnZ2xhbXAuZ2xiJmJ1eVVSTD1odHRwcyUzQSUyRiUyRjNkdHdpbnMuZXMlMkY=",
    title: "Egglamp",
    price: "129€",
    image: "sources/egglamp.png",
    meta: "Printing On demand",
    type: "grid",
    tags: ["lamp", "lighting", "design", "minimal", "3d","huevo",]
  },
  
];
