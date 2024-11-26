interface CategoryData {
    name: string;
    type: 'income' | 'expense' | 'other'; 
    user_id: string;
}

export default CategoryData;