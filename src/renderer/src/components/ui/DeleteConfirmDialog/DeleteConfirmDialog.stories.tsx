import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Trash2, FileX, UserX, FolderX } from 'lucide-react';
import { Button } from '../Button';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';

const meta: Meta<typeof DeleteConfirmDialog> = {
  title: 'Layout/DeleteConfirmDialog',
  component: DeleteConfirmDialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const DeleteDialogTemplate = ({ 
  buttonText = "Delete Item", 
  onConfirm = () => console.log('Delete confirmed'),
  ...dialogProps 
}: any) => {
  const [open, setOpen] = useState(false);
  
  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };
  
  return (
    <>
      <Button variant="destructive" onClick={() => setOpen(true)}>
        <Trash2 className="h-4 w-4 mr-2" />
        {buttonText}
      </Button>
      <DeleteConfirmDialog
        {...dialogProps}
        open={open}
        onOpenChange={setOpen}
        onConfirm={handleConfirm}
      />
    </>
  );
};

export const Default: Story = {
  render: () => (
    <DeleteDialogTemplate
      title="Delete Item"
      description="Are you sure you want to delete this item? This action cannot be undone."
    />
  ),
};

export const DeleteFile: Story = {
  render: () => (
    <DeleteDialogTemplate
      buttonText="Delete File"
      title="Delete File"
      description="Are you sure you want to delete 'document.pdf'? This action cannot be undone."
      itemName="document.pdf"
      onConfirm={() => console.log('File deleted')}
    />
  ),
};

export const DeleteUser: Story = {
  render: () => (
    <DeleteDialogTemplate
      buttonText="Remove User"
      title="Remove User"
      description="Are you sure you want to remove this user from the project? They will lose access immediately."
      itemName="john.doe@example.com"
      confirmText="Remove User"
      onConfirm={() => console.log('User removed')}
    />
  ),
};

export const DeleteProject: Story = {
  render: () => (
    <DeleteDialogTemplate
      buttonText="Delete Project"
      title="Delete Project"
      description="This will permanently delete the project and all its data. All team members will lose access and this action cannot be undone."
      itemName="My Awesome Project"
      confirmText="Delete Project"
      variant="destructive"
      onConfirm={() => console.log('Project deleted')}
    />
  ),
};

export const CustomConfirmText: Story = {
  render: () => (
    <DeleteDialogTemplate
      buttonText="Archive Item"
      title="Archive Item"
      description="Are you sure you want to archive this item? You can restore it later if needed."
      confirmText="Archive Now"
      cancelText="Keep Active"
      onConfirm={() => console.log('Item archived')}
    />
  ),
};

export const WithWarning: Story = {
  render: () => (
    <DeleteDialogTemplate
      buttonText="Delete Account"
      title="Delete Account"
      description="This will permanently delete your account and all associated data. This includes all your projects, files, and settings."
      itemName="your account"
      confirmText="Delete Account"
      variant="destructive"
      onConfirm={() => console.log('Account deleted')}
    >
      <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
        <div className="flex items-start space-x-2">
          <div className="text-destructive">⚠️</div>
          <div className="text-sm">
            <p className="font-medium text-destructive">Warning</p>
            <p className="text-destructive/80">
              This action is irreversible. Make sure you have backed up any important data.
            </p>
          </div>
        </div>
      </div>
    </DeleteDialogTemplate>
  ),
};

export const MultipleItems: Story = {
  render: () => (
    <DeleteDialogTemplate
      buttonText="Delete Selected"
      title="Delete Multiple Items"
      description="Are you sure you want to delete these 5 selected items? This action cannot be undone."
      itemName="5 selected items"
      confirmText="Delete All"
      onConfirm={() => console.log('Multiple items deleted')}
    />
  ),
};

export const DifferentIcons: Story = {
  render: () => {
    const [activeDialog, setActiveDialog] = useState<string | null>(null);
    
    const actions = [
      {
        key: 'file',
        icon: <FileX className="h-4 w-4 mr-2" />,
        label: 'Delete File',
        title: 'Delete File',
        description: 'This file will be permanently deleted.',
        itemName: 'important-document.pdf',
      },
      {
        key: 'user',
        icon: <UserX className="h-4 w-4 mr-2" />,
        label: 'Remove User',
        title: 'Remove User',
        description: 'This user will be removed from the project.',
        itemName: 'John Doe',
        confirmText: 'Remove User',
      },
      {
        key: 'folder',
        icon: <FolderX className="h-4 w-4 mr-2" />,
        label: 'Delete Folder',
        title: 'Delete Folder',
        description: 'This folder and all its contents will be deleted.',
        itemName: 'Project Assets',
        confirmText: 'Delete Folder',
      },
    ];
    
    return (
      <div className="space-x-2">
        {actions.map((action) => (
          <Button 
            key={action.key}
            variant="destructive" 
            onClick={() => setActiveDialog(action.key)}
          >
            {action.icon}
            {action.label}
          </Button>
        ))}
        
        {actions.map((action) => (
          <DeleteConfirmDialog
            key={action.key}
            open={activeDialog === action.key}
            onOpenChange={(open) => !open && setActiveDialog(null)}
            title={action.title}
            description={action.description}
            itemName={action.itemName}
            confirmText={action.confirmText}
            onConfirm={() => {
              console.log(`${action.title} confirmed`);
              setActiveDialog(null);
            }}
          />
        ))}
      </div>
    );
  },
};

export const LoadingState: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const handleConfirm = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setLoading(false);
      setOpen(false);
      console.log('Delete completed');
    };
    
    return (
      <>
        <Button variant="destructive" onClick={() => setOpen(true)}>
          <Trash2 className="h-4 w-4 mr-2" />
          Delete with Loading
        </Button>
        <DeleteConfirmDialog
          open={open}
          onOpenChange={setOpen}
          title="Delete Item"
          description="This operation may take a few seconds to complete."
          itemName="large-file.zip"
          onConfirm={handleConfirm}
          confirmText={loading ? "Deleting..." : "Delete"}
        />
      </>
    );
  },
};

export const AllVariations: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DeleteDialogTemplate
          buttonText="Simple Delete"
          title="Delete Item"
          description="Are you sure you want to delete this item?"
        />
        
        <DeleteDialogTemplate
          buttonText="Delete with Details"
          title="Delete File"
          description="This will permanently delete the selected file."
          itemName="document.pdf"
        />
        
        <DeleteDialogTemplate
          buttonText="Custom Text"
          title="Archive Project"
          description="Move this project to the archive?"
          confirmText="Archive"
          cancelText="Keep Active"
        />
        
        <DeleteDialogTemplate
          buttonText="Destructive Variant"
          title="Permanent Deletion"
          description="This action cannot be undone."
          variant="destructive"
          confirmText="Delete Forever"
        />
      </div>
      
      <div className="pt-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">
          Different Use Cases
        </h3>
        <div className="flex flex-wrap gap-2">
          <DeleteDialogTemplate
            buttonText="Delete Account"
            title="Delete Account"
            description="Your account and all data will be permanently removed."
            itemName="your account"
            variant="destructive"
          />
          
          <DeleteDialogTemplate
            buttonText="Remove Access"
            title="Remove User Access"
            description="This user will no longer have access to the project."
            confirmText="Remove Access"
          />
          
          <DeleteDialogTemplate
            buttonText="Clear Data"
            title="Clear All Data"
            description="This will remove all stored data and reset the application."
            confirmText="Clear Data"
            variant="destructive"
          />
        </div>
      </div>
    </div>
  ),
};