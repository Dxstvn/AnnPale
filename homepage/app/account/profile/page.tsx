import { Metadata } from "next"

export const metadata: Metadata = {
  title: "My Profile - Ann Pale",
  description: "Manage your Ann Pale profile and preferences",
}

export default function ProfilePage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 lg:px-6 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        <div className="grid gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            {/* TODO: Implement profile form */}
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Preferences</h2>
            {/* TODO: Implement preferences */}
          </div>
        </div>
      </div>
    </div>
  )
}