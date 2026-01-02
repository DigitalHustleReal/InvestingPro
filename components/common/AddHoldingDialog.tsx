"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";

interface AddHoldingDialogProps {
    onAdd: (holding: any) => void;
    user: any;
}

export default function AddHoldingDialog({ onAdd, user }: AddHoldingDialogProps) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        asset_type: 'mutual-fund',
        asset_name: '',
        asset_category: 'equity',
        quantity: '',
        purchase_price: '',
        current_price: '',
        purchase_date: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const quantity = parseFloat(formData.quantity);
        const purchasePrice = parseFloat(formData.purchase_price);
        const currentPrice = parseFloat(formData.current_price);

        const investedAmount = quantity * purchasePrice;
        const currentValue = quantity * currentPrice;
        const returns = currentValue - investedAmount;
        const returnsPercentage = investedAmount > 0
            ? ((returns / investedAmount) * 100).toFixed(2)
            : "0.00";

        const holding = {
            ...formData,
            user_email: user.email,
            quantity,
            purchase_price: purchasePrice,
            current_price: currentPrice,
            invested_amount: investedAmount,
            current_value: currentValue,
            returns,
            returns_percentage: parseFloat(returnsPercentage)
        };

        onAdd(holding);
        setOpen(false);
        setFormData({
            asset_type: 'mutual-fund',
            asset_name: '',
            asset_category: 'equity',
            quantity: '',
            purchase_price: '',
            current_price: '',
            purchase_date: ''
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-primary-600 hover:bg-primary-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Holding
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Add New Holding</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label>Asset Type</Label>
                        <Select value={formData.asset_type} onValueChange={(val: string) => setFormData({ ...formData, asset_type: val })}>
                            <SelectTrigger>
                                <div className="flex items-center">
                                    <span>{formData.asset_type === 'mutual-fund' ? 'Mutual Fund' : formData.asset_type.toUpperCase()}</span>
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="mutual-fund">Mutual Fund</SelectItem>
                                <SelectItem value="stock">Stock</SelectItem>
                                <SelectItem value="etf">ETF</SelectItem>
                                <SelectItem value="bond">Bond</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Asset Name</Label>
                        <Input
                            required
                            value={formData.asset_name}
                            onChange={(e) => setFormData({ ...formData, asset_name: e.target.value })}
                            placeholder="e.g., Parag Parikh Flexi Cap"
                        />
                    </div>

                    <div>
                        <Label>Category</Label>
                        <Select value={formData.asset_category} onValueChange={(val: string) => setFormData({ ...formData, asset_category: val })}>
                            <SelectTrigger>
                                <div className="flex items-center">
                                    <span>{formData.asset_category.charAt(0).toUpperCase() + formData.asset_category.slice(1)}</span>
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="equity">Equity</SelectItem>
                                <SelectItem value="debt">Debt</SelectItem>
                                <SelectItem value="hybrid">Hybrid</SelectItem>
                                <SelectItem value="gold">Gold</SelectItem>
                                <SelectItem value="international">International</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Quantity</Label>
                            <Input
                                type="number"
                                step="0.001"
                                required
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label>Purchase Price</Label>
                            <Input
                                type="number"
                                step="0.01"
                                required
                                value={formData.purchase_price}
                                onChange={(e) => setFormData({ ...formData, purchase_price: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Current Price</Label>
                            <Input
                                type="number"
                                step="0.01"
                                required
                                value={formData.current_price}
                                onChange={(e) => setFormData({ ...formData, current_price: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label>Purchase Date</Label>
                            <Input
                                type="date"
                                required
                                value={formData.purchase_date}
                                onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1 bg-primary-600">Add Holding</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
