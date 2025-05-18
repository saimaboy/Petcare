"use client";

import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { 
  Pencil, Trash2, Plus, Search, Package, FilterX, LogOut, Loader2, AlertCircle, CheckCircle, XCircle 
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function PharmacyDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("products");
  const [pharmData, setPharmData] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const [editSelectedImage, setEditSelectedImage] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);
  const editFileInputRef = useRef(null);

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "medicine",
    stock: "",
    image: "",
  });

  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProductsAndProfile = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login?redirect=/pharmacy-dashboard');
        return;
      }

      const profileResponse = await fetch(`${API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (profileResponse.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        router.push('/login?redirect=/pharmacy-dashboard');
        return;
      }

      if (!profileResponse.ok) {
        throw new Error(`Failed to fetch profile: ${profileResponse.statusText}`);
      }

      const profileData = await profileResponse.json();

      if (profileData.data.role !== 'pharmacist') {
        router.push('/dashboard');
        return;
      }

      setPharmData(profileData.data);

      const productsResponse = await fetch(`${API_URL}/products/pharmacy`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!productsResponse.ok) {
        throw new Error(`Failed to fetch products: ${productsResponse.statusText}`);
      }

      const productsData = await productsResponse.json();
      setProducts(productsData.data || []);

      // Fetch all orders for pharmacist
      const ordersResponse = await fetch(`${API_URL}/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!ordersResponse.ok) {
        const errorText = await ordersResponse.text();
        console.error("Orders fetch failed:", ordersResponse.status, errorText);
        throw new Error(`Failed to fetch orders: ${ordersResponse.statusText}`);
      }

      const ordersData = await ordersResponse.json();
      console.log("Orders fetched:", ordersData);
      setOrders(ordersData.orders || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message || "Failed to load dashboard data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsAndProfile();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    router.push('/login');
  };

  useEffect(() => {
    if (isEditDialogOpen && editingProduct) {
      setEditImagePreview(editingProduct.image || null);
      setEditSelectedImage(null);
      if (editFileInputRef.current) editFileInputRef.current.value = "";
    }
  }, [isEditDialogOpen, editingProduct]);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterCategory === "all") {
      return matchesSearch;
    } else {
      return matchesSearch && product.category === filterCategory;
    }
  });

  const resetFilters = () => {
    setSearchTerm("");
    setFilterCategory("all");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: value,
    });
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCategoryChange = (category) => {
    setNewProduct({
      ...newProduct,
      category
    });
  };

  const handleEditImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditSelectedImage(file);
      setEditImagePreview(URL.createObjectURL(file));
    }
  };

  const handleEditCategoryChange = (category) => {
    setEditingProduct({
      ...editingProduct,
      category
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct({
      ...editingProduct,
      [name]: value,
    });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append("name", newProduct.name);
      formData.append("description", newProduct.description);
      formData.append("price", newProduct.price);
      formData.append("category", newProduct.category);
      formData.append("stock", newProduct.stock);
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Failed to add product: ${response.statusText}`);
      }

      await fetchProductsAndProfile();

      setNewProduct({
        name: "",
        description: "",
        price: "",
        category: "medicine",
        stock: "",
        image: "",
      });
      setSelectedImage(null);
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Error adding product:", error);
      setError(`Failed to add product: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append("name", editingProduct.name);
      formData.append("description", editingProduct.description);
      formData.append("price", editingProduct.price);
      formData.append("category", editingProduct.category);
      formData.append("stock", editingProduct.stock);
      if (editSelectedImage) {
        formData.append("image", editSelectedImage);
      }

      const response = await fetch(`${API_URL}/products/${editingProduct._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Failed to update product: ${response.statusText}`);
      }

      await fetchProductsAndProfile();

      setEditingProduct(null);
      setIsEditDialogOpen(false);
      setEditSelectedImage(null);
      setEditImagePreview(null);
    } catch (error) {
      console.error("Error updating product:", error);
      setError(`Failed to update product: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async () => {
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/products/${productToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to delete product: ${response.statusText}`);
      }

      await fetchProductsAndProfile();

      setProductToDelete(null);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting product:", error);
      setError(`Failed to delete product: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmOrder = async (orderId) => {
    setIsSubmitting(true);
    try {
      console.log("Confirming order with ID:", orderId);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/orders/${orderId}/confirm`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'delivering' })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Confirm order failed:", response.status, errorText);
        throw new Error(`Failed to confirm order: ${response.statusText}`);
      }

      await fetchProductsAndProfile();
    } catch (error) {
      console.error("Error confirming order:", error);
      setError(`Failed to confirm order: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeclineOrder = async (orderId) => {
    setIsSubmitting(true);
    try {
      console.log("Declining order with ID:", orderId);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Decline order failed:", response.status, errorText);
        throw new Error(`Failed to decline order: ${response.statusText}`);
      }

      await fetchProductsAndProfile();
    } catch (error) {
      console.error("Error declining order:", error);
      setError(`Failed to decline order: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-16 flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4" />
          <p className="text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-16">
        <Alert variant="destructive" className="max-w-lg mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Pharmacy Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            {pharmData?.businessName || pharmData?.name || 'Pharmacy'}
          </p>
        </div>
        <div className="mt-4 md:mt-0 space-x-2">
          <Button onClick={() => setIsAddDialogOpen(true)} variant="default">
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="products" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>
        
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Product Management</CardTitle>
              <CardDescription>Manage your medicines, pet food, and accessories</CardDescription>
              <div className="flex flex-col md:flex-row gap-4 mt-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search products..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select 
                  value={filterCategory} 
                  onValueChange={setFilterCategory}
                >
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="medicine">Medicines</SelectItem>
                    <SelectItem value="petfood">Pet Food</SelectItem>
                    <SelectItem value="accessory">Accessories</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={resetFilters} className="md:w-auto">
                  <FilterX className="mr-2 h-4 w-4" /> Reset
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="mt-4 text-lg font-medium">No products found</p>
                  <p className="text-muted-foreground">
                    {products.length === 0 
                      ? "You haven't added any products yet." 
                      : "No products match your search criteria."}
                  </p>
                  {products.length === 0 && (
                    <Button 
                      onClick={() => setIsAddDialogOpen(true)} 
                      className="mt-4"
                    >
                      <Plus className="mr-2 h-4 w-4" /> Add Your First Product
                    </Button>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((product) => (
                        <TableRow key={product._id}>
                          <TableCell>
                            {product.image ? (
                              <img 
                                src={product.image} 
                                alt={product.name}
                                className="h-12 w-12 object-cover rounded-md" 
                              />
                            ) : (
                              <div className="h-12 w-12 bg-muted rounded-md flex items-center justify-center">
                                <Package className="h-6 w-6 text-muted-foreground" />
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {product.category === "medicine" && "Medicine"}
                              {product.category === "petfood" && "Pet Food"}
                              {product.category === "accessory" && "Accessory"}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatCurrency(product.price)}</TableCell>
                          <TableCell>{product.stock}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setEditingProduct(product);
                                  setIsEditDialogOpen(true);
                                }}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setProductToDelete(product);
                                  setIsDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Order Management</CardTitle>
              <CardDescription>View and manage customer orders</CardDescription>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="mt-4 text-lg font-medium">No orders found</p>
                  <p className="text-muted-foreground">
                    There are currently no orders to manage.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order._id}>
                          <TableCell>{order._id}</TableCell>
                          <TableCell>{order.userId?.name || order.userId}</TableCell>
                          <TableCell>{formatCurrency(order.total)}</TableCell>
                          <TableCell>
                            <Badge variant={order.status === "delivering" ? "default" : "secondary"}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => handleConfirmOrder(order._id)}
                                disabled={isSubmitting || order.status !== "pending"}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" /> Confirm
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeclineOrder(order._id)}
                                disabled={isSubmitting || order.status !== "pending"}
                              >
                                <XCircle className="h-4 w-4 mr-1" /> Decline
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Pharmacy Profile</CardTitle>
              <CardDescription>Your business and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-lg font-medium mb-4">Business Details</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Business Name</p>
                      <p className="text-lg">{pharmData.businessName || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">License Number</p>
                      <p className="text-lg">{pharmData.licenseNumber || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Service Type</p>
                      <p className="text-lg capitalize">{pharmData.serviceType || 'Pharmacy'}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                      <p className="text-lg">{pharmData.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Email</p>
                      <p className="text-lg">{pharmData.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
                      <p className="text-lg">{pharmData.phoneNumber || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Address</h3>
                {pharmData.address && Object.values(pharmData.address).some(v => v) ? (
                  <div>
                    <p>{pharmData.address.street}</p>
                    <p>{`${pharmData.address.city}, ${pharmData.address.state} ${pharmData.address.zipCode}`}</p>
                    <p>{pharmData.address.country}</p>
                  </div>
                ) : (
                  <p>No address information provided</p>
                )}
              </div>
              
              <div className="pt-4">
                <Button onClick={() => router.push('/profile/edit')}>
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Add a new product to your inventory. Fill in all the details below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddProduct}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input 
                  id="name" 
                  name="name"
                  value={newProduct.name}
                  onChange={handleInputChange}
                  className="col-span-3" 
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">Category</Label>
                <Select 
                  value={newProduct.category} 
                  onValueChange={handleCategoryChange}
                  name="category"
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="medicine">Medicine</SelectItem>
                    <SelectItem value="petfood">Pet Food</SelectItem>
                    <SelectItem value="accessory">Accessory</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">Price ($)</Label>
                <Input 
                  id="price" 
                  name="price"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={newProduct.price}
                  onChange={handleInputChange}
                  className="col-span-3" 
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="stock" className="text-right">Stock</Label>
                <Input 
                  id="stock" 
                  name="stock"
                  type="number"
                  min="0"
                  step="1"
                  value={newProduct.stock}
                  onChange={handleInputChange}
                  className="col-span-3" 
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="image" className="text-right">Image</Label>
                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageFileChange}
                  className="col-span-3"
                />
              </div>
              {imagePreview && (
                <div className="col-span-4 flex justify-center mb-2">
                  <img src={imagePreview} alt="Preview" className="h-24 rounded" />
                </div>
              )}
              
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right pt-2">Description</Label>
                <Textarea 
                  id="description" 
                  name="description"
                  value={newProduct.description}
                  onChange={handleInputChange}
                  className="col-span-3 min-h-[100px]" 
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Product
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update the product information.
            </DialogDescription>
          </DialogHeader>
          {editingProduct && (
            <form onSubmit={handleEditProduct}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-name" className="text-right">Name</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    value={editingProduct.name}
                    onChange={handleEditChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-category" className="text-right">Category</Label>
                  <Select
                    value={editingProduct.category}
                    onValueChange={handleEditCategoryChange}
                    name="category"
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="medicine">Medicine</SelectItem>
                      <SelectItem value="petfood">Pet Food</SelectItem>
                      <SelectItem value="accessory">Accessory</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-price" className="text-right">Price ($)</Label>
                  <Input
                    id="edit-price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={editingProduct.price}
                    onChange={handleEditChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-stock" className="text-right">Stock</Label>
                  <Input
                    id="edit-stock"
                    name="stock"
                    type="number"
                    min="0"
                    step="1"
                    value={editingProduct.stock}
                    onChange={handleEditChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-image" className="text-right">Image</Label>
                  <input
                    id="edit-image"
                    name="image"
                    type="file"
                    accept="image/*"
                    ref={editFileInputRef}
                    onChange={handleEditImageFileChange}
                    className="col-span-3"
                  />
                </div>
                {editImagePreview && (
                  <div className="col-span-4 flex justify-center mb-2">
                    <img src={editImagePreview} alt="Preview" className="h-24 rounded" />
                  </div>
                )}
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="edit-description" className="text-right pt-2">Description</Label>
                  <Textarea
                    id="edit-description"
                    name="description"
                    value={editingProduct.description}
                    onChange={handleEditChange}
                    className="col-span-3 min-h-[100px]"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
      
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteProduct}
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}